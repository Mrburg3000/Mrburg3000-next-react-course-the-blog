"use client";

import { Button } from "@/components/Button";
import { InputCheckbox } from "@/components/InputCheckbox";
import { InputText } from "@/components/InputText";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useActionState, useEffect, useState } from "react";
import { ImageUploader } from "../ImageUploader";
import { makePartialPublicPost, PublicPost } from "@/dto/post/dto";
import { createPostAction } from "@/actions/post/create-post-action";
import { toast } from "react-toastify";
import { updatePostAction } from "@/actions/post/update-post-action";
import { useRouter, useSearchParams } from "next/navigation";

type ManagePostFormUpdateProps = {
    mode: "update";
    publicPost: PublicPost;
};

type ManagePostFormCreateProps = {
    mode: "create";
};

type ManagePostFormProps =
    | ManagePostFormUpdateProps
    | ManagePostFormCreateProps;

export function ManagePostForm(props: ManagePostFormProps) {
    const { mode } = props;
    const searchParams = useSearchParams();
    const created = searchParams.get("created");
    const router = useRouter();

    let publicPost;
    if (mode === "update") {
        publicPost = props.publicPost;
    }

    const actionsMap = {
        update: updatePostAction,
        create: createPostAction,
    };
    const initialState = {
        formState: makePartialPublicPost(publicPost),
        errors: [],
    };
    const [state, action, isPending] = useActionState(
        actionsMap[mode],
        initialState
    );
    console.log("Form state updated:", state);
    useEffect(() => {
        console.log("State errors changed:", state.errors);
        if (state.errors.length > 0) {
            console.log("Showing error toasts:", state.errors);
            toast.dismiss();
            state.errors.forEach((error) => toast.error(error));
        }
    }, [state.errors]);

    useEffect(() => {
        if (state.success) {
            toast.dismiss();
            toast.success("Post atualizado com sucesso!");
        }
    }, [state.success]);

    useEffect(() => {
    if (created === '1') {
      toast.dismiss();
      toast.success('Post criado com sucesso!');
      const url = new URL(window.location.href);
      url.searchParams.delete('created');
      router.replace(url.toString());
    }
  }, [created, router]);
    
    const { formState } = state;
    const [contentValue, setContentValue] = useState(publicPost?.content || "");

    return (
        <form action={action} className="mb-16">
            <div className="flex flex-col gap-6">
                <InputText
                    labelText="ID"
                    name="id"
                    placeholder="ID gerado automaticamente"
                    type="text"
                    defaultValue={formState.id}
                    disabled={isPending}
                    readOnly
                />

                {/* Hidden input to send ID in FormData */}
                <input
                    type="hidden"
                    name="id"
                    value={formState.id || ""}
                />

                <InputText
                    labelText="Slug"
                    name="slug"
                    placeholder="Slug gerada automaticamente"
                    type="text"
                    defaultValue={formState.slug}
                    disabled={isPending}
                    readOnly
                />

                {/* Hidden input to send Slug in FormData */}
                <input
                    type="hidden"
                    name="slug"
                    value={formState.slug || ""}
                />

                <InputText
                    labelText="Autor"
                    name="author"
                    placeholder="Digite o nome do autor"
                    type="text"
                    disabled={isPending}
                    defaultValue={formState.author}
                />

                <InputText
                    labelText="Título"
                    name="title"
                    placeholder="Digite o título"
                    type="text"
                    disabled={isPending}
                    defaultValue={formState.title}
                />

                <InputText
                    labelText="Excerto"
                    name="excerpt"
                    placeholder="Digite o resumo"
                    disabled={isPending}
                    type="text"
                    defaultValue={formState.excerpt}
                />

                <MarkdownEditor
                    labelText="Conteúdo"
                    value={contentValue}
                    setValue={setContentValue}
                    textAreaName="content"
                    disabled={isPending}
                />

                {/* Hidden input to ensure content is sent in FormData */}
                <input
                    type="hidden"
                    name="content"
                    value={contentValue}
                />

                <ImageUploader disabled={isPending} />

                <InputText
                    labelText="URL da imagem de capa"
                    name="coverImageUrl"
                    placeholder="Digite a url da imagem"
                    type="text"
                    disabled={isPending}
                    defaultValue={formState.coverImageUrl}
                />

                <InputCheckbox
                    labelText="Publicar?"
                    name="published"
                    type="checkbox"
                    disabled={isPending}
                    defaultChecked={formState.published}
                />

                <div className="mt-4">
                    <Button disabled={isPending} type="submit">
                        Enviar
                    </Button>
                </div>
            </div>
        </form>
    );
}
