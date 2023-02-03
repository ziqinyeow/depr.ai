import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
// import data from "data/depression_test";
// import advice from "data/generated_text";
import Link from "next/link";
import { useRouter } from "next/router";
import { BertTokenizer } from "lib/bert_tokenizer";
import { inference, load } from "lib/inference";

// const Question: React.FC = () => {
//   return <div></div>;
// };

const Home: NextPage = () => {
  const [globalScore, setGlobalScore] = useState(0);
  const [tokenizer, setTokenizer] = useState<BertTokenizer>();
  const [session, setSession] = useState<any>();
  const [emotion, setEmotion] = useState<any>();
  const [emotionTime, setEmotionTime] = useState<any>();
  const [depression, setDepression] = useState<any>();
  const [depressionTime, setDepressionTime] = useState<any>();

  const nlp = async (e: ChangeEvent<HTMLTextAreaElement>) => {
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
    const ds = window.localStorage.getItem("ds");
    // const ps = window.localStorage.getItem("ps");
    setGlobalScore(Number(ds));
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
      <main className="">
        <div className="layout">
          <div className="flex items-center justify-center w-full">
            <div className="md:min-w-[50vw] xl:min-w-[30vw] 2xl:min-w-[20vw] space-y-6 text-justify">
              <h2 className="">Express your thoughts</h2>
              <h4>Tell me about your thoughts today.</h4>
              <textarea
                className="w-full p-2 border-2 rounded-md focus:border-blue-600 focus:outline-none"
                onChange={nlp}
                name="input_1"
                // id=""
                cols={30}
                rows={5}
                disabled={!tokenizer}
              ></textarea>
              {!tokenizer && (
                <div className="mt-3 text-xs text-gray-600">
                  loading model ...
                </div>
              )}
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
              {/* <div className="grid w-full grid-cols-2 gap-5">
                <Link href="/test/depression">
                  <a className="box-border relative z-30 inline-flex items-center justify-center w-full px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-blue-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-blue-300 ring-offset-blue-200 hover:ring-offset-blue-500 ease focus:outline-none">
                    <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="relative z-20 flex items-center text-base">
                      Depression
                    </span>
                  </a>
                </Link>
                <Link href="/test/personality">
                  <a className="box-border relative z-30 inline-flex items-center justify-center w-full px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-blue-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-blue-300 ring-offset-blue-200 hover:ring-offset-blue-500 ease focus:outline-none">
                    <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="relative z-20 flex items-center text-base">
                      Personality
                    </span>
                  </a>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 mt-20 border-t">
        <div className="flex items-center justify-center gap-2">
          Powered by{" "}
          <h4 className="font-bold text-blue-600"><a href='https://github.com/ziqinyeow/depr.ai'>@ziqinyeow</a></h4>
        </div>
      </footer>
    </div>
  );
};

export default Home;

// export const getStaticProps: GetStaticProps = () => {
//   return {
//     props: {
//       advice: advice.slice(100),
//     },
//   };
// };
