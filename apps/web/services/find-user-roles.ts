import { prisma } from "@repo/database";

export async function findUserRoles(userId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role || null;
  } catch (error) {
    console.error("Erro ao buscar role do usuário:", error);
    return null;
  }
}
