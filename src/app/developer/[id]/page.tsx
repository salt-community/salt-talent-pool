"use client";
import UserCard from "@/app/developer/components/UserCard";
import Skills from "@/app/developer/components/Skills";
import TeamMembers from "@/app/developer/components/Team";
import { api } from "@/trpc/react";
import Projects from "@/app/developer/components/Projects";
import Contact from "@/app/developer/components/Contact";
import { useSession } from "next-auth/react";
import GitHubCalendar from "../components/GitHubContributions/GitHubContributions";
import { useState, type ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import Icon from "@/app/assets/icons/Icon";
const options = ["Skills", "Bio", "Projects"] as const;
type Option = (typeof options)[number];
const DeveloperPage = ({ params: { id } }: { params: { id: string } }) => {
  const [view, setView] = useState<Option>("Skills");
  const { data: developer, status } = api.developer.getBySlug.useQuery({ id });
  const { data: session } = useSession();
  const gitHubUsername = developer ? developer.gitHubUsername : null;
  const xs = useMediaQuery({ query: "(max-width: 360px)" });
  const sm = useMediaQuery({ query: "(max-width: 480px)" });
  return (
    <main
      className={`flex grow flex-col items-center gap-5 bg-gradient-to-b from-orange to-pink pt-5 md:px-5 ${
        !session && "pb-5"
      }`}
    >
      <UserCard data={{ data: developer!, status }} />
      <section className="flex w-full grow flex-col gap-10 bg-gray px-5 pt-5 md:max-w-5xl md:rounded-md">
        <nav className="flex justify-around">
          {options.map((i) => (
            <button
              key={`${i}-button`}
              className={`w-1/3 select-none rounded-lg py-1 text-center font-primary font-semibold tracking-widest md:tracking-wide lg:w-1/6 ${
                view === i && "bg-orange text-white"
              }`}
              onClick={() => setView(i)}
            >
              {i}
            </button>
          ))}
        </nav>
        <Article className={`${view !== "Skills" && "hidden"}`}>
          <Skills data={{ data: developer!, status }} />
        </Article>
        <Article
          title={developer?.title}
          className={`${view !== "Bio" && "hidden"}`}
        >
          {status === "success" && (
            <p className="font-primary">{developer.description}</p>
          )}
        </Article>
        <Article className={`${view !== "Projects" && "hidden"}`}>
          <Projects data={{ data: developer!, status }} />
        </Article>
        <Article className={`${view !== "Skills" && "hidden"}`}>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium md:text-3xl">GitHub</h2>
            {developer && (
              <a href={developer.gitHubUrl} target="_blank">
                <Icon icon="github" className="h-10 w-10 fill-black" />
              </a>
            )}
          </div>
          <div className="[&_svg]:w-full">
            <GitHubCalendar
              username={gitHubUsername}
              fontSize={xs ? 10 : sm ? 12 : 16}
              colorScheme="light"
              blockSize={xs ? 5 : sm ? 6 : 12}
              blockMargin={sm ? 1 : 4}
              blockRadius={sm ? 1 : 2}
            />
          </div>
        </Article>
        <Article title="Team" className="pb-10">
          {status === "success" && developer.mobs.length > 0 && (
            <TeamMembers mob={developer.mobs[0]!} />
          )}
        </Article>
      </section>
      {session && status === "success" && <Contact developer={developer} />}
    </main>
  );
};

type ArticleProps = { title?: string; className?: string; children: ReactNode };
const Article = ({ title, className, children }: ArticleProps) => {
  return (
    <article className={`flex flex-col gap-4 ${className}`}>
      {title && <h2 className="text-xl font-medium md:text-3xl">{title}</h2>}
      {children}
    </article>
  );
};

export default DeveloperPage;
