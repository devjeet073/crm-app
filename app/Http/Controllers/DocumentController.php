<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use App\Models\DocumentFolder;
use App\Models\File;
use App\Picklists;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;
        $folderId = $request->string('folder_id')->toString() ?: null;
        [$sort, $direction] = $this->resolveSort($request);

        $documents = Document::query()
            ->with(['assignedUser', 'folder', 'createdBy', 'file'])
            ->when($search, fn ($q, $s) => $q->where(fn ($q) => $q
                ->where('name', 'like', "%{$s}%")
                ->orWhere('type', 'like', "%{$s}%")))
            ->when($folderId, fn ($q) => $q->where('folder_id', $folderId))
            ->when(
                $sort === 'assigned_to',
                fn ($q) => $q
                    ->leftJoin('users as assigned_users', 'documents.assigned_user_id', '=', 'assigned_users.id')
                    ->select('documents.*')
                    ->orderBy('assigned_users.name', $direction),
                fn ($q) => $q->orderBy($sort, $direction),
            )
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('documents/index', [
            'documents' => $documents,
            'folders' => DocumentFolder::orderBy('name')->get(['id', 'name', 'parent_id']),
            'filters' => [
                'search' => $search,
                'folder_id' => $folderId,
                'sort' => $sort,
                'direction' => $direction,
            ],
            ...$this->formProps(),
        ]);
    }

    /**
     * @return array{0: string, 1: 'asc'|'desc'}
     */
    private function resolveSort(Request $request): array
    {
        $sortable = ['name', 'status', 'type', 'publish_date', 'expiration_date', 'assigned_to', 'created_at'];
        $sort = $request->string('sort')->toString();
        $sort = \in_array($sort, $sortable, true) ? $sort : 'created_at';
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';

        return [$sort, $direction];
    }

    public function create(): Response
    {
        return Inertia::render('documents/create', $this->formProps());
    }

    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $document = Document::create($data + [
            'id' => Str::random(17),
            'created_by_id' => $request->user()?->id,
            'modified_by_id' => $request->user()?->id,
        ]);

        if ($request->hasFile('file')) {
            $this->handleFileUpload($request, $document);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document created.')]);

        return to_route('documents.show', $document);
    }

    public function show(Document $document): Response
    {
        $document->load(['assignedUser', 'createdBy', 'modifiedBy', 'folder', 'leads', 'accounts', 'file']);

        return Inertia::render('documents/show', [
            'document' => $document,
        ]);
    }

    public function edit(Document $document): Response
    {
        $document->load(['assignedUser', 'file']);

        return Inertia::render('documents/edit', [
            'document' => $document,
            ...$this->formProps(),
        ]);
    }

    public function update(UpdateDocumentRequest $request, Document $document): RedirectResponse
    {
        $data = $request->validated();

        $document->update($data + [
            'modified_by_id' => $request->user()?->id,
        ]);

        if ($request->hasFile('file')) {
            $this->deleteDocumentFile($document);
            $this->handleFileUpload($request, $document);
        } elseif ($request->boolean('remove_file')) {
            $this->deleteDocumentFile($document);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document updated.')]);

        return to_route('documents.show', $document);
    }

    public function destroy(Document $document): RedirectResponse
    {
        $this->deleteDocumentFile($document);
        $document->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document deleted.')]);

        return to_route('documents.index');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = collect(explode(',', $request->string('ids')->toString()))
            ->map(fn (string $id) => trim($id))
            ->filter()
            ->values();

        Document::whereIn('id', $ids)->each(function (Document $document) {
            $this->deleteDocumentFile($document);
            $document->delete();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Documents deleted.')]);

        return to_route('documents.index', [
            'search' => $request->string('search')->toString() ?: null,
            'folder_id' => $request->string('folder_id')->toString() ?: null,
            'sort' => $request->string('sort')->toString() ?: 'created_at',
            'direction' => $request->string('direction')->toString() ?: 'desc',
        ]);
    }

    public function download(Document $document): StreamedResponse
    {
        $file = $document->file;

        abort_unless($file, 404, 'No file attached to this document.');

        if (! Storage::disk($file->disk)->exists($file->path)) {
            abort(404, 'File not found on storage.');
        }

        return Storage::disk($file->disk)->download($file->path, $file->original_name);
    }

    private function handleFileUpload(Request $request, Document $document): void
    {
        $uploadedFile = $request->file('file');
        $originalName = $uploadedFile->getClientOriginalName();
        $extension = $uploadedFile->extension();

        $fileRecord = File::create([
            'id' => Str::random(17),
            'name' => sprintf('%s_%s.%s', Str::random(24), time(), $extension),
            'original_name' => $originalName,
            'mime_type' => $uploadedFile->getMimeType(),
            'size' => $uploadedFile->getSize(),
            'disk' => 'local',
            'path' => '', // placeholder, updated below
            'uploaded_by_id' => $request->user()?->id,
        ]);

        $path = $uploadedFile->storeAs('documents', $fileRecord->name, 'local');

        $fileRecord->update(['path' => $path]);

        $document->update(['file_id' => $fileRecord->id]);
    }

    private function deleteDocumentFile(Document $document): void
    {
        $file = $document->file;

        if (! $file) {
            return;
        }

        if (Storage::disk($file->disk)->exists($file->path)) {
            Storage::disk($file->disk)->delete($file->path);
        }

        $file->delete();
    }

    /**
     * @return array<string, mixed>
     */
    private function formProps(): array
    {
        return [
            'folders' => DocumentFolder::orderBy('name')->get(['id', 'name', 'parent_id']),
            'statuses' => Picklists::DOCUMENT_STATUSES,
            'types' => Picklists::DOCUMENT_TYPES,
        ];
    }
}
