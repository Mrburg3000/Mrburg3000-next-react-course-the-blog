"use server";

import { postRepository } from "@/repositories/post";
import { revalidatePath } from "next/cache";
import { verifyLoginSession } from "@/lib/login/manage-login";

export async function deletePostAction(id: string) {
    const isAuthenticated = await verifyLoginSession();

    if (!isAuthenticated) {
        return {
            error: "Faça login novamente em outra aba",
        };
    }

    if (!id || typeof id !== "string") {
        return {
            error: "Dados inválidos",
        };
    }

    try {
        await postRepository.delete(id);
    } catch (e: unknown) {
        if (e instanceof Error) {
            return {
                error: e.message,
            };
        }
        return {
            error: "Erro desconhecido",
        };
    }

    revalidatePath("/admin/posts");
    revalidatePath("/");

    return {
        error: "",
    };
}
