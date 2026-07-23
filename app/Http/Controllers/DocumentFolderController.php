<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentFolderRequest;
use App\Http\Requests\UpdateDocumentFolderRequest;
use App\Models\DocumentFolder;
use App\Models\DocumentFolderPath;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentFolderController extends Controller
{
    public function index(Request $request): Response
    {
        $folders = DocumentFolder::query()
            ->with(['parent', 'createdBy'])
            ->withCount('documents')
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('documents/folders/index', [
            'folders' => $folders,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('documents/folders/create', [
            'parentFolders' => DocumentFolder::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreDocumentFolderRequest $request): RedirectResponse
    {
        $folderId = Str::random(17);

        $folder = DocumentFolder::create($request->validated() + [
            'id' => $folderId,
            'created_by_id' => $request->user()?->id,
            'modified_by_id' => $request->user()?->id,
        ]);

        // ── Maintain closure table ───────────────────────────────────────
        // Self-pair
        DocumentFolderPath::create([
            'ascendor_id' => $folderId,
            'descendor_id' => $folderId,
        ]);

        // Inherit all ancestor rows from the parent
        if ($folder->parent_id) {
            $ancestors = DocumentFolderPath::where('descendor_id', $folder->parent_id)->get();
            foreach ($ancestors as $ancestor) {
                DocumentFolderPath::create([
                    'ascendor_id' => $ancestor->ascendor_id,
                    'descendor_id' => $folderId,
                ]);
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Folder created.')]);

        return to_route('document-folders.index');
    }

    public function edit(DocumentFolder $documentFolder): Response
    {
        return Inertia::render('documents/folders/edit', [
            'folder' => $documentFolder->load('parent'),
            'parentFolders' => DocumentFolder::where('id', '!=', $documentFolder->id)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function update(UpdateDocumentFolderRequest $request, DocumentFolder $documentFolder): RedirectResponse
    {
        $documentFolder->update($request->validated() + [
            'modified_by_id' => $request->user()?->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Folder updated.')]);

        return to_route('document-folders.index');
    }

    public function destroy(DocumentFolder $documentFolder): RedirectResponse
    {
        // Remove all closure-table rows for this folder
        DocumentFolderPath::where('ascendor_id', $documentFolder->id)
            ->orWhere('descendor_id', $documentFolder->id)
            ->delete();

        $documentFolder->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Folder deleted.')]);

        return to_route('document-folders.index');
    }
}
