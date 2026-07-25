import { Form } from '@inertiajs/react';
export default function Test() {
    return <Form defaults={{ name: '' }}>{(props: any) => {
 console.log(Object.keys(props));

 return null; 
}}</Form>;
}
