import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";
import Comment from "./_components/Comment";

const page = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return (
      <main className="flex grow items-center justify-center">
        <p>You are not allowed here!</p>
      </main>
    );
  }
  if (session && session.user.role !== "ADMIN") {
    <main className="flex grow items-center justify-center">
      <p>You are not allowed here {session.user.role}!</p>
    </main>;
  }
  const cartItems = await api.log.getCarts.query();
  const className = "border text-xs md:text-base";
  return (
    <main className="flex flex-col">
      <section className="flex w-full max-w-5xl flex-col self-center p-5">
        <table>
          <thead>
            <tr>
              <td className={className}>Timestamp</td>
              <td className={className}>Client email</td>
              <td className={className}>Developer</td>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(
              ({
                id,
                date,
                comment,
                userId,
                User: { email },
                developer: { name },
              }) => (
                <tr key={id}>
                  <td className={className}>
                    {date.toLocaleTimeString("sv-SE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className={className}>
                    <Link
                      className="underline"
                      href={`/admin/client/${userId}`}
                    >
                      {email}
                    </Link>
                  </td>
                  <td className={className}>
                    {comment ? <Comment comment={comment} name={name} /> : name}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default page;
