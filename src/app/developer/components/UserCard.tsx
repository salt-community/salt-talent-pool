"use client";
import Image from "next/image";
import type { RouterOutputs } from "@/trpc/shared";
import Icon from "@/app/assets/icons/Icon";
import AddToCart from "./AddToCart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import parseLocalStorage from "./helpers/parseLocalStorage";

type Developer = RouterOutputs["developer"]["getBySlug"];
type Props = { developer: Developer };
const UserCard = ({ developer }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const [bigImage, setBigImage] = useState(false);
  const router = useRouter();

  const { search } = parseLocalStorage(developer.slug);
  const locations = showMore
    ? developer.locationPref
    : developer.locationPref.slice(0, 3);
  return (
    <>
      {bigImage ? (
        <>
          <div
            onClick={() => setBigImage((p) => !p)}
            className="fixed right-0 top-0 z-10 flex h-screen w-screen cursor-zoom-out items-center bg-black/90"
          ></div>
          <section
            onClick={() => setBigImage((p) => !p)}
            className="relative z-20 flex w-full max-w-5xl cursor-zoom-out justify-center gap-2 bg-black p-2 md:rounded-md"
          >
            <Icon
              icon="close"
              className="absolute right-2 top-2 w-10 fill-white"
            />
            <Image
              className="h-full rounded-full"
              src={developer.image}
              alt="profile picture"
              width={512}
              height={512}
            />
          </section>
        </>
      ) : (
        <section className="relative flex w-full max-w-5xl items-center justify-center gap-2 rounded-md border border-black/20 bg-gray p-5 pt-10 shadow-lg">
          <button
            onClick={() => router.push(!!search ? `/?search=${search}` : "/")}
            className="absolute left-2 top-2 w-10"
          >
            <Icon icon="arrowLeft" className="h-10 fill-black" />
          </button>
          <div className="absolute right-2 top-2">
            <AddToCart developerId={developer.id} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Image
                onClick={() => setBigImage((p) => !p)}
                className="h-28 w-28 cursor-zoom-in rounded-full"
                src={developer.image}
                alt="profile picture"
                width={256}
                height={256}
              />
              <h1 className="text-center text-2xl font-semibold">
                {developer.name}
              </h1>
            </div>
            {!!developer.locationPref.length && (
              <div className="flex select-none flex-col gap-0">
                <p className="text-center text-sm text-black/60">
                  Open for work in
                </p>
                <div className="flex flex-col">
                  <ul className="flex flex-wrap items-center justify-center gap-1">
                    {locations.map((loc, i, arr) => (
                      <li className="relative flex" key={loc}>
                        <p className="text-sm text-orange/90">{`${loc}${
                          i !== arr.length - 1 ? "," : ""
                        }`}</p>
                        {i === 0 && (
                          <Icon
                            icon="mapMarker"
                            className="absolute -left-[17px] top-0 h-4"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                  {developer.locationPref.length > 3 && (
                    <button
                      className="w-fit self-center text-sm underline underline-offset-2"
                      onClick={() => setShowMore((p) => !p)}
                    >
                      {showMore ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <a href={developer.gitHubUrl} target="_blank">
                <Icon icon="github" className="h-10 w-10 fill-black" />
              </a>
              <a href={developer.linkedinUrl} target="_blank">
                <Icon icon="linkedin" className="h-10 w-10 fill-black" />
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default UserCard;
