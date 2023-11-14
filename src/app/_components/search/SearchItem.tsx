import Image from "next/image";
import type { RouterOutputs } from "@/trpc/shared";
import ItemContainer from "../ItemContainer";
import LogLink from "./LogLink";
import Icon from "@/app/assets/icons/Icon";

type DeveloperSearch = RouterOutputs["developer"]["getBySearch"][number];
type Props = {
  developer: DeveloperSearch;
  inCart: boolean;
};

const SearchItem = ({ developer, inCart }: Props) => {
  return (
    <LogLink developerId={developer.id}>
      <ItemContainer className="relative">
        <Image
          src={developer.image}
          alt="Image"
          width={256}
          height={256}
          className="w-20 rounded-full border-none"
        />
        <div className="flex grow flex-col">
          <h2 className="text-xl font-normal lg:text-2xl">{developer.name}</h2>
          <ul className="flex flex-wrap gap-1">
            {developer.skills.slice(0, 4).map((skill, index) => (
              <li
                className="lg:text-md flex items-center text-sm text-black/50"
                key={skill + index}
              >
                <p className="whitespace-nowrap">{skill}</p>
              </li>
            ))}
            {developer.skills.length - 4 > 0 && (
              <li className="text-[0.6rem] text-sm text-black/40">
                +{developer.skills.length - 4}
              </li>
            )}
          </ul>
        </div>
        <p className="text-md hidden overflow-hidden overflow-ellipsis whitespace-nowrap md:flex">
          {developer.title}
        </p>
        {inCart && <Icon icon="cart" className="absolute right-1 top-1 h-6 fill-orange/40" />}
      </ItemContainer>
    </LogLink>
  );
};

export default SearchItem;
