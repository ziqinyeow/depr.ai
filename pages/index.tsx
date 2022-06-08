import type { NextPage } from "next";
import Head from "next/head";
import * as THREE from "three";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import Image from "next/image";
import { load, inference } from "lib/inference";
import { BertTokenizer } from "lib/bert_tokenizer";
import Link from "next/link";

const Home: NextPage = () => {
  const [globalScore, setGlobalScore] = useState(0);
  const [tokenizer, setTokenizer] = useState<BertTokenizer>();
  const [session, setSession] = useState<any>();
  const [emotion, setEmotion] = useState<any>();
  const [emotionTime, setEmotionTime] = useState<any>();
  const [depression, setDepression] = useState<any>();
  const [depressionTime, setDepressionTime] = useState<any>();
  // console.log(tokenizer, session);

  const nlp = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "") {
      setEmotion([]);
      setEmotionTime("");
      setDepression([]);
      setDepressionTime("");
    } else {
      const { emotion, depression }: any = await inference(
        tokenizer,
        session[0],
        session[1],
        e.target.value
      );
      setEmotionTime(emotion[0]);
      setDepressionTime(depression[0]);
      // @ts-ignore
      setEmotion([emotion[1][1], emotion[1][2]]);
      setDepression([depression[1][1], depression[1][2]]);
    }
  };

  const download = async () => {
    const { tokenizer, emotion, depression } = await load();
    setTokenizer(tokenizer);
    setSession([emotion, depression]);
  };

  useEffect(() => {
    const s = window.localStorage.getItem("s");
    setGlobalScore(Number(s));
    download();
  }, []);

  return (
    <div>
      <Head>
        <title>Depr.ai</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="layout">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <a className="flex items-center gap-6 text-sm text-blue-600 text-bold">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="#2563eb"
                xmlns="http://www.w3.org/2000/svg"
                className="font-bold w-7 h-7"
              >
                <path
                  d="M4.60913 0.0634287C4.39082 0.0088505 4.16575 0.12393 4.08218 0.332867L3.1538 2.6538L0.832866 3.58218C0.702884 3.63417 0.604504 3.7437 0.566705 3.87849C0.528906 4.01329 0.555994 4.158 0.639992 4.26999L2.01148 6.09864L1.06343 9.89085C1.00944 10.1068 1.12145 10.3298 1.32691 10.4154L4.20115 11.613L5.62557 13.7496C5.73412 13.9124 5.93545 13.9864 6.12362 13.9327L9.62362 12.9327C9.62988 12.9309 9.63611 12.929 9.64229 12.9269L12.6423 11.9269C12.7923 11.8769 12.905 11.7519 12.9393 11.5976L13.9393 7.09761C13.9776 6.92506 13.9114 6.74605 13.77 6.63999L11.95 5.27499V2.99999C11.95 2.82955 11.8537 2.67373 11.7012 2.5975L8.70124 1.0975C8.67187 1.08282 8.64098 1.07139 8.60913 1.06343L4.60913 0.0634287ZM11.4323 6.01173L12.7748 7.01858L10.2119 9.15429C10.1476 9.20786 10.0995 9.2783 10.0731 9.35769L9.25382 11.8155L7.73849 10.8684C7.52774 10.7367 7.25011 10.8007 7.11839 11.0115C6.98667 11.2222 7.05074 11.4999 7.26149 11.6316L8.40341 12.3453L6.19221 12.9771L4.87441 11.0004C4.82513 10.9265 4.75508 10.8688 4.67307 10.8346L2.03046 9.73352L2.85134 6.44999H4.99999C5.24852 6.44999 5.44999 6.24852 5.44999 5.99999C5.44999 5.75146 5.24852 5.54999 4.99999 5.54999H2.72499L1.7123 4.19974L3.51407 3.47903L6.35769 4.4269C6.53655 4.48652 6.73361 4.42832 6.85138 4.28111L8.62413 2.06518L11.05 3.27811V5.19533L8.83287 6.08218C8.70996 6.13134 8.61494 6.23212 8.57308 6.35769L8.07308 7.85769C7.99449 8.09346 8.12191 8.34831 8.35769 8.4269C8.59346 8.50549 8.84831 8.37807 8.9269 8.14229L9.3609 6.84029L11.4323 6.01173ZM7.71052 1.76648L6.34462 3.47386L4.09505 2.724L4.77192 1.03183L7.71052 1.76648ZM10.2115 11.7885L12.116 11.1537L12.7745 8.19034L10.8864 9.76374L10.2115 11.7885Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              Depr.ai!
            </a>
          </Link>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600 text-bold">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="">{Math.round(globalScore)}</div>
          </div>
        </div>
      </div>
      <main className="layout">
        <div className="lg:grid w-full grid-cols-3 gap-4 min-h-[40vh]">
          <div className="col-span-2">
            <h1 className="mb-3 text-6xl font-bold">
              Welcome to <span className="text-blue-600">Depr.ai!</span>
            </h1>
            <h3>
              The AI platform for detecting and reducing your depression rate.
            </h3>
            <h4 className="mt-6 text-justify">
              <span className="font-bold text-blue-600">Depression</span> is a
              common and serious medical illness that negatively affects how you
              feel, the way you think and how you act. Depression causes
              feelings of sadness and/or a loss of interest in activities you
              once enjoyed. It can lead to a variety of emotional and physical
              problems and can decrease your ability to function at work and at
              home.{" "}
              <a
                href="https://psychiatry.org/patients-families/depression/what-is-depression"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:font-bold"
              >
                (Read More)
              </a>
            </h4>
            <div className="mb-20">
              <div className="flex items-center gap-5 mt-5">
                <div className="box-border relative z-30 inline-flex items-center justify-center w-auto overflow-hidden font-bold text-white transition-all duration-300 bg-blue-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-blue-300 ring-offset-blue-200 hover:ring-offset-blue-500 ease focus:outline-none">
                  <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  <input
                    className="relative z-20 flex items-center px-5 py-3 text-base text-blue-600 bg-white outline-none disabled:cursor-not-allowed"
                    type="text"
                    placeholder="Your thoughts today?"
                    disabled={!tokenizer}
                    onChange={nlp}
                  ></input>
                </div>
                <div>or</div>
                <Link href="/test">
                  <a
                    // href="#_"
                    className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-blue-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-blue-300 ring-offset-blue-200 hover:ring-offset-blue-500 ease focus:outline-none"
                  >
                    <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="relative z-20 flex items-center text-base">
                      Take a test
                    </span>
                  </a>
                </Link>
              </div>
              {emotion && emotionTime && (
                <div className="flex items-end gap-3 mt-3">
                  {emotion?.map((e: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        // @ts-ignore
                        opacity: e[1] / 100 + 0.5,
                      }}
                    >
                      {e[0]} ({e[1]})
                    </span>
                  ))}
                  <span className="text-sm text-gray-300">{`- ${emotionTime} ms inference time`}</span>
                </div>
              )}
              {depression && depressionTime && (
                <div className="flex items-end gap-3 mt-3">
                  {depression?.map((d: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        // @ts-ignore
                        opacity: d[1] / 100 + 0.5,
                      }}
                    >
                      {d[0]} ({d[1]})
                    </span>
                  ))}
                  <span className="text-sm text-gray-300">{`- ${depressionTime} ms inference time`}</span>
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <SpinningMesh
                position={[0, 1, 0]}
                color="#2563eb"
                args={[3, 2, 1]}
                speed={1}
              />
              <OrbitControls />
            </Canvas>
          </div>
        </div>
        <div className="flex justify-start w-full mt-10 mb-8 md:mt-0">
          <h1 className="text-6xl">
            Our <span className="text-blue-600">Solutions</span>
          </h1>
        </div>
        <div className="grid w-full gap-5 md:grid-cols-3">
          <div className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-white rounded-md cursor-pointer hover:bg-blue-600 group active:scale-95 ring-offset-2 ring-1 ring-blue-600 ring-offset-blue-200 hover:ring-offset-blue-700 ease focus:outline-none">
            <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
            <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
            <div className="relative z-20 flex flex-col items-center">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-black group-hover:text-white"
              >
                <path
                  d="M7.75432 1.81954C7.59742 1.72682 7.4025 1.72682 7.24559 1.81954L1.74559 5.06954C1.59336 5.15949 1.49996 5.32317 1.49996 5.5C1.49996 5.67683 1.59336 5.84051 1.74559 5.93046L7.24559 9.18046C7.4025 9.27318 7.59742 9.27318 7.75432 9.18046L13.2543 5.93046C13.4066 5.84051 13.5 5.67683 13.5 5.5C13.5 5.32317 13.4066 5.15949 13.2543 5.06954L7.75432 1.81954ZM7.49996 8.16923L2.9828 5.5L7.49996 2.83077L12.0171 5.5L7.49996 8.16923ZM2.25432 8.31954C2.01658 8.17906 1.70998 8.2579 1.56949 8.49564C1.42901 8.73337 1.50785 9.03998 1.74559 9.18046L7.24559 12.4305C7.4025 12.5232 7.59742 12.5232 7.75432 12.4305L13.2543 9.18046C13.4921 9.03998 13.5709 8.73337 13.4304 8.49564C13.2899 8.2579 12.9833 8.17906 12.7456 8.31954L7.49996 11.4192L2.25432 8.31954Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              <h2 className="text-blue-600 group-hover:text-white">Quiz</h2>
              <h4 className="mt-4 text-base text-center text-gray-500 group-hover:text-white">
                Analyze your quiz result
              </h4>
            </div>
          </div>
          <div className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-white rounded-md cursor-pointer hover:bg-blue-600 group active:scale-95 ring-offset-2 ring-1 ring-blue-600 ring-offset-blue-200 hover:ring-offset-blue-700 ease focus:outline-none">
            <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
            <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
            <div className="relative z-20 flex flex-col items-center">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-black group-hover:text-white"
              >
                <path
                  d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM3 10.5C3 10.2239 3.22386 10 3.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H3.5C3.22386 11 3 10.7761 3 10.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              <h2 className="text-blue-600 group-hover:text-white">Language</h2>
              <h4 className="mt-4 text-base text-center text-gray-500 group-hover:text-white">
                Analyze your text thought
              </h4>
            </div>
          </div>
          <div className="relative">
            <div className="absolute px-3 py-1 text-sm font-bold text-blue-600 border border-blue-600 rounded-md right-2 top-2 bg-gray-50">
              Coming soon
            </div>
            <div className="p-5 border-2 border-blue-600 rounded-md opacity-30">
              <div className="flex flex-col items-center">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                >
                  <path
                    d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <h2 className="text-blue-600">Vision</h2>
                <h4 className="mt-4 text-base text-center text-gray-500">
                  Analyze your picture
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-start w-full mb-10 mt-28">
          <h1 className="text-6xl break-all">
            <span className="text-blue-600">Tech</span>nologies
          </h1>
        </div>
        <div className="w-full mb-10">
          <div className="w-full grid-cols-2 md:grid">
            <div className="relative w-full h-full min-h-[30vh]">
              <Image
                src="/images/web_tech.png"
                layout="fill"
                objectFit="contain"
                className=""
              />
            </div>
            <div className="md:p-8">
              <h3 className="mb-2 font-bold text-blue-600 underline">Web</h3>
              <h4 className="mb-2">
                We use amazing web technologies to build this application.
              </h4>
              <h4>
                <b>Next.js</b> - Full stack React framework
              </h4>
              <h4>
                <b>Tailwind</b> - Style
              </h4>
              <h4>
                <b>Three.js</b> - JS 3D library
              </h4>
              <h4>
                <b>Planetscale</b> - MySQL Serverless DB
              </h4>
              <h4>
                <b>Prisma</b> - ORM
              </h4>
              <h4>
                <b>Framer/Spring</b> - Animations
              </h4>
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <div className="w-full grid-cols-2 md:grid">
            <div className="md:p-8 md:text-right">
              <h3 className="mb-2 font-bold text-blue-600 underline">
                Machine Learning
              </h3>
              <h4 className="mb-2">
                We use amazing machine learning technologies to train the model.
              </h4>
              <h4>
                Exporting production model - <b>TensorFlow</b>
              </h4>
              <h4>
                Research modelling params - <b>PyTorch</b>
              </h4>
              <h4>
                Utility modelling package - <b>Scikit Learn</b>
              </h4>
              <h4>
                Transformer - <b>HuggingFace</b>
              </h4>
              <h4>
                Logging and visualizing - <b>WANDB</b>
              </h4>
            </div>
            <div className="relative w-full h-full min-h-[30vh]">
              <Image
                src="/images/ml_tech.png"
                layout="fill"
                objectFit="contain"
                className=""
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 mt-20 border-t">
        <div className="flex items-center justify-center gap-2">
          Powered by Team{" "}
          <h4 className="font-bold text-blue-600">GPT3 with StyleGAN3</h4>
        </div>
      </footer>
    </div>
  );
};

export default Home;

const SpinningMesh = ({ position, color, speed, args }: any) => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  const [expand, setExpand] = useState(false);
  return (
    <mesh
      position={position}
      ref={mesh}
      onClick={() => setExpand(!expand)}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={args} />
      <MeshWobbleMaterial
        color={color}
        speed={speed}
        attach="material"
        factor={0.6}
      />
    </mesh>
  );
};

// function Box(props: JSX.IntrinsicElements["mesh"]) {
//   const mesh = useRef<THREE.Mesh>(null!);
//   const [hovered, setHover] = useState(false);
//   const [active, setActive] = useState(false);
//   useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
//     </mesh>
//   );
// }
