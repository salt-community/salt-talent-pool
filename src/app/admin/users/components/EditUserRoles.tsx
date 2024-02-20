"use client";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { zRole, type tRole } from "@/utils/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Developer } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Users = RouterOutputs["users"]["getAll"][number];
type Props = { user: Users };
const EditUserRole = ({ user }: Props) => {
  
    let developer: Developer | null = null

    if(user.developerId) {
      const {
        data: fetchedDeveloper,
      } = api.developer.getById.useQuery({ id: user.developerId });
      developer = fetchedDeveloper ?? null
    }

  const { mutate: updatePublished } = api.developer.changePublish.useMutation({
      onSuccess: () => router.refresh(),
    });
  
  const handlePublished = () => {
    // fetch developer
    // find the value of developer.published
    // update the value of developer.published
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore jsjsjs
    updatePublished({ id: user.developerId, published: !developer.published });
  };

  const router = useRouter();
  const { mutate: update } = api.users.changeRole.useMutation({
    onSuccess: () => router.refresh(),
  });
  const {
    handleSubmit,
    register,
    formState: { isDirty, isSubmitSuccessful },
    reset,
  } = useForm<tRole>({
    resolver: zodResolver(zRole),
    defaultValues: { role: user.role },
  });
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({}, { keepValues: true });
    }
  }, [isSubmitSuccessful, reset]);
  return (
    <li className="flex items-center justify-between border px-1 text-xs md:text-base">
      {user.role === "CLIENT" ? (
        <Link className="underline" href={`/admin/client/${user.id}`}>
          {user.email}
        </Link>
      ) : (
        <p>{user.email}</p>
      )}
      <form
        onSubmit={(event) =>
          void handleSubmit(({ role }) =>
            update({ id: user.id, zRole: { role } }),
          )(event)
        }
      >
        {isDirty && <button className="px-5">Save</button>}
        {user.developerId && (
          <div>
            <label htmlFor="publishDev">
              Publish
              <input
                id="publishDev"
                type="checkbox"
                checked={developer?.published ? true : false}
                onChange={() => handlePublished()}
              />
            </label>
          </div>
        )}
        <select {...register("role")}>
          <option>SALTIE</option>
          <option>CLIENT</option>
          <option>ADMIN</option>
        </select>
      </form>
    </li>
  );
};

export default EditUserRole;
