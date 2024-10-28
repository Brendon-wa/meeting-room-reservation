import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-zinc-400 flex border items-center rounded-t-3xl justify-center mx-auto w-full">
      <div className="items-center w-10/12 mx-auto py-10 px-4 gap-16 sm:p-20 md:flex">
        <Image
          src="/logo.png"
          alt="Next.js logo"
          width={150}
          height={38}
          priority
        />
      </div>
      <div className="flex flex-col w-4/12 py-10 sm:p-20 bottom-0">
        <div>
          <span className="text-white text-md font-bold">E-mail: </span>
          <span className="text-white text-md">rent@mail.com</span>
        </div>
        <div>
          <span className="text-white text-md font-bold">Telefone: </span>
          <span className="text-white text-md">(+55) 55 3333-0000</span>
        </div>
      </div>
    </footer>
  );
}
