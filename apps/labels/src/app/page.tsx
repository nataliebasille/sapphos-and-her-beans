import Image from 'next/image';
import { coffeeDescriptions } from './coffee_descriptions';

type Coffee = (typeof coffeeDescriptions)[keyof typeof coffeeDescriptions];

export default function Home() {
  return (
    <div className='grid grid-cols-1 gap-3 justify-center items-center place-items-center h-full w-full'>
      <Label {...coffeeDescriptions.Totutla} />
    </div>
  );
}

{
  /* <Label {...coffeeDescriptions.Brazil} />
      <Label {...coffeeDescriptions.Colombia} />
      <Label {...coffeeDescriptions.Ethiopia} />
      <Label {...coffeeDescriptions.Mexico} />
      <Label {...coffeeDescriptions.EthiopiaDecaf} /> */
}

const Label = (coffee: Coffee) => {
  return (
    <div className='w-[4in] h-[6in] overflow-hidden flex flex-col'>
      <div
        className='w-full h-2/5 bg-center bg-no-repeat bg-cover scale-150'
        style={{
          backgroundImage: `url('./sappho_logo.png')`,
        }}
      />
      <div
        // 5x3 inch labels
        className={`relative w-full h-3/5 border-8 border-t-0 border-${coffee.color}-900 bg-${coffee.color}-50 flex flex-col`}
      >
        <div
          className={`absolute top-0 right-0 bg-${coffee.color}-900 w-[48px] h-[36px] flex justify-center items-center text-${coffee.color}-50 font-bold`}
        >
          {coffee.size}oz
        </div>
        <div className='flex flex-initial'>
          <div className='flex-1 p-2 flex flex-col'>
            <div className='relative w-[64px] h-[64px]'>
              <Image
                src='/site qr code.png'
                alt='qr-code'
                fill
                className={`object-contain border-${coffee.color}-900 border-2`}
              />
            </div>
            <span
              className={`text-${coffee.color}-950 text-xs tracking-wide font-bold pl-2`}
            >
              FIND ME
            </span>
          </div>
          <div style={{ fontFamily: 'fantasy' }} className='w-3/4 ml-auto mt-8'>
            <div
              className={`text-4xl uppercase font-bold text-center text-${coffee.color}-950 pt-3`}
            >
              {coffee.country}
            </div>
            <div className='text-xl tracking-widest'>
              <div
                className={`relative h-[36px] font-bold flex justify-center items-end text-center bg-${coffee.color}-900 text-white rounded-l-full`}
              >
                {coffee.farm}
              </div>
            </div>
          </div>
        </div>

        <div className='flex-1 grid place-content-center'>
          <div
            className={`italic tracking-wide mt-3 mb-2 px-2 text-center text-lg/5 font-bold text-${coffee.color}-950 flex-1`}
          >
            {coffee.tastingNotes}
          </div>

          <div
            className={`grid grid-cols-[max-content_1fr] border-y-2 border-${coffee.color}-900 mt-1 text-xs`}
          >
            <div
              className={`grid grid-cols-subgrid grid-rows-subgrid row-span-5 gap-[1px] text-${coffee.color}-50 text-right uppercase font-bold  font-mono *:flex *:justify-end *:items-center`}
            >
              <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Process</div>
              <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Lot</div>
              <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Region</div>
              <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>
                Varietals
              </div>
              <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Altitude</div>
            </div>

            <div
              className={`grid grid-cols-subgrid grid-rows-subgrid font-bold tracking-wider row-span-5 gap-[1px] text-${coffee.color}-950 bg-${coffee.color}-900`}
            >
              <div
                className={`bg-${coffee.color}-50 px-2 font-bold tracking-wider uppercase`}
              >
                {coffee.processing}
              </div>
              <div className={`bg-${coffee.color}-50 px-2`}>{coffee.lot}</div>
              <div className={`bg-${coffee.color}-50 px-2`}>
                {coffee.region}
              </div>
              <div className={`bg-${coffee.color}-50 px-2`}>
                {coffee.varietals}
              </div>
              <div className={`bg-${coffee.color}-50 px-2`}>
                {coffee.altitude}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex text-xs pb-1 px-2 tracking-wider font-serif text-${coffee.color}-950 font-bold`}
        >
          <div className='flex text-[.7rem] items-end leading-[10px]'>
            Roasted on:{' '}
            <div
              className={`ml-1 border-b-[1px] border-${coffee.color}-950 w-4`}
            />
            <span className='px-[2px] -mr-1 mb-[1px]'>/</span>
            <div
              className={`border-b-[1px] border-${coffee.color}-950 w-4`}
            />{' '}
          </div>

          <span className='italic ml-auto '>
            Traceable to <span>{coffee.traceable}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const SpecialBeanBoxLabel = () => {
  const coffee: Coffee = {
    size: '2.5',
    country: 'House blend',
    farm: (
      <>
        <span className='text-base'>Blend of our</span>
        <br />
        <b>Sumatra & Ethiopia Duromina</b>
      </>
    ),
    color: 'lime',
    tastingNotes:
      'Bright nuttiness with mellow notes of chocolate and cherries',
  };

  return (
    <div className='w-[3in] h-[5in] overflow-hidden'>
      <div
        className='bg-center bg-no-repeat bg-cover w-full h-1/3 overflow-hidden scale-125'
        style={{
          backgroundImage: `url('./sappho_logo.png')`,
        }}
      />
      <div
        className={`relative border-8 border-${coffee.color}-900 bg-${coffee.color}-50 h-2/3 flex flex-col`}
      >
        <div
          style={{ fontFamily: 'fantasy' }}
          className={`p-6 pb-2 text-${coffee.color}-950 text-center`}
        >
          <div className='text-2xl font-bold uppercase text-center'>
            {coffee.country}
          </div>

          <div className='text-lg tracking-widest mt-2'>{coffee.farm}</div>
        </div>

        <div className='flex-initial flex gap-2 items-center px-4'>
          <div className={`h-[2px] flex-1 bg-${coffee.color}-900`}></div>
          <div
            className={`w-[14px] aspect-square border-2 border-${coffee.color}-900 origin-center rotate-45`}
          ></div>
          <div className={`h-[2px] flex-1 bg-${coffee.color}-900`}></div>
        </div>
        <div
          className={`flex-1 italic tracking-wide px-5 text-center text-lg font-bold text-${coffee.color}-950 flex-1 basis-2/3 text-center text-balance leading-6 pt-3`}
        >
          {coffee.tastingNotes}
        </div>

        <div className={`absolute bottom-0 left-0 flex gap-1 items-end`}>
          <div
            className={`relative w-[40px] h-[40px] overflow-hidden border-${coffee.color}-900 border-2 border-l-0 border-b-0`}
          >
            <Image
              src='/site qr code.png'
              alt='qr-code'
              fill
              className={`object-contain scale-110`}
            />
          </div>

          <span className='text-sm'>← Find me</span>
        </div>

        <div
          className={`absolute bottom-0 right-0 bg-${coffee.color}-900 text-white p-2`}
        >
          <span className='font-bold'>{coffee.size} oz </span>
        </div>
        {/* <div
          className={`absolute top-0 right-0 bg-${coffee.color}-900 w-[38px] h-[28px] flex justify-center items-center text-${coffee.color}-50 font-bold text-sm`}
        >
          {coffee.size}oz
        </div>
        <div className='flex flex-1'>
          <div className='flex-1 basis-1/3 p-2 flex flex-col'>
            
            <span
              className={`text-${coffee.color}-950 text-[.5rem] tracking-wide font-bold pl-2`}
            >
              FIND ME
            </span>
          </div>
          <div style={{ fontFamily: 'fantasy' }} className='w-full mx-auto'>
            <div
              className={`text-2xl uppercase font-bold text-center text-${coffee.color}-950 pt-9`}
            >
              {coffee.country}
            </div>
          </div>
        </div>

        <div className='py-2 px-1 flex-initial'>
          <div className='text-xl tracking-widest  px-[.625rem]'>
            <div
              className={`relative h-5 font-bold flex justify-center items-end text-center bg-${coffee.color}-900 text-white`}
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 left-0 w-[0.88388347648rem] aspect-square bg-${coffee.color}-900 origin-center`}
              ></div>
              <div
                className={`absolute top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 right-0 w-[0.88388347648rem] aspect-square bg-${coffee.color}-900 origin-center`}
              ></div>
              {coffee.farm}
            </div>
          </div>
        </div>

        <div
          className={`italic tracking-wide px-5 text-center text-lg font-bold text-${coffee.color}-950 flex-1 basis-2/3 place-content-center text-balance leading-6`}
        >
          {coffee.tastingNotes}
        </div>*/}
      </div>
    </div>
  );
};

// const Label = (coffee: Coffee) => {
//   return (
//     <div
//       // 5x3 inch labels
//       className={`w-[5in] h-[3in] border-8 border-${coffee.color}-900 bg-${coffee.color}-900/10`}
//     >
//       <div className={`w-full h-full text-${coffee.color}-900 relative`}>
//         <div
//           className={`top-0 left-0 absolute px-2 py-1 bg-${coffee.color}-900 text-white`}
//         >
//           <span className='font-bold'>{coffee.size} oz </span>
//         </div>
//         <div className='h-full font-bold grid grid-cols-[1fr_75%] grid-rows-[max-content_min-content_1fr]'>
//           <div className='relative self-center p-7'>
//             {/* <div className='aspect-square relative'>
//               <Image
//                 src='/fake qr code.jpg'
//                 fill
//                 className={`object-contain border-${coffee.color}-900 border-4 aspect-square`}
//                 alt='qr-code'
//               />
//             </div>
//             <span className='text-xs text-center text-black uppercase tracking-tight inline-block w-full'>
//               Find me
//             </span> */}
//           </div>
//           <div className='text-center self-center py-3'>
//             <div
//               className='text-3xl uppercase font-bold'
//               style={{ fontFamily: 'fantasy' }}
//             >
//               {coffee.country}
//             </div>
//             <div
//               className={`relative text-xl px-6 flex justify-center items-end bg-${coffee.color}-900 text-white text-center h-[36px] tracking-widest rounded-l-full`}
//               style={{ fontFamily: 'fantasy' }}
//             >
//               {coffee.farm}
//             </div>
//           </div>

//           <div className='px-[32px] col-span-2'>
//             <div
//               className={`relative text-sm py-[.375rem] uppercase font-bold text-center col-span-2 bg-${coffee.color}-900 text-white`}
//             >
//               <div
//                 className={`aspect-square absolute h-[70.710678118%] top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 rotate-45 bg-${coffee.color}-900`}
//               ></div>
//               {coffee.tastingNotes}
//             </div>
//           </div>

//           <div
//             className={`bg-${coffee.color}-900/30 text-${coffee.color}-950 col-span-2 items-end px-4 tracking-wider font-sans gap-2 relative`}
//           >
//             <div className='text-xl text-right'>Process:</div>
//             <div className='text-xl'>Natural</div>
//             <div className='text-xl text-right'>Lot:</div>
//             <div>Nguisse Nare, Bombe, Natural, Grade 1</div>
//             <div className='text-xl text-right'>Region:</div>
//             <div>Sidama Bensa Bombe</div>
//             <div className='text-xl text-right'>Varietals:</div>
//             <div>74158</div>
//             <div className='text-xl text-right'>Altitude:</div>
//             <div>2,240 meters</div>

//             <div className='text-sm italic col-span-2'>
//               * Traceable to Nguisse Nare and 60 registered outgrowers
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const EthiopianLabel = () => {
  return (
    <div className='w-[6in] h-[4in] border-8 border-orange-900 bg-[#F8DCDF]'>
      <div className='w-full h-full p-5 pb-0 text-orange-900 relative'>
        <div className='h-full font-bold grid grid-cols-[1fr_75%] grid-rows-[1fr_1fr]'>
          <div className='relative mr-5 mb-5'>
            <Image
              src='/fake qr code.jpg'
              fill
              className='object-contain'
              alt='qr-code'
            />
            <span className='absolute -bottom-4 text-xs text-center text-black uppercase tracking-tight inline-block w-full'>
              Find me
            </span>
          </div>
          <div className='text-center'>
            <div
              className='text-5xl uppercase'
              style={{ fontFamily: 'fantasy' }}
            >
              Ethiopia
            </div>
            <div
              className='text-3xl px-6 py-2 bg-orange-900 text-white text-center -mr-8 w-[calc(100%+1.5rem)]  rounded-l-full'
              style={{ fontFamily: 'fantasy' }}
            >
              Nguisse Nare
            </div>
            <div className='mt-1 italic text-lg'>
              Lavendar, plum, peach, rose water
            </div>
          </div>

          <div className='bg-orange-900/30 text-orange-950 col-span-2 items-end border-orange-900 border-t-4 px-4 tracking-wider font-sans gap-2 grid grid-cols-[max-content_1fr] -ml-5 -mr-5 py-1 w-[calc(100%+2.5rem)] '>
            <div className='text-xl text-right'>Process:</div>
            <div className='text-xl'>Natural</div>
            <div className='text-xl text-right'>Lot:</div>
            <div>Nguisse Nare, Bombe, Natural, Grade 1</div>
            <div className='text-xl text-right'>Region:</div>
            <div>Sidama Bensa Bombe</div>
            <div className='text-xl text-right'>Varietals:</div>
            <div>74158</div>
            <div className='text-xl text-right'>Altitude:</div>
            <div>2,240 meters</div>

            <div className='text-sm italic col-span-2'>
              * Traceable to Nguisse Nare and 60 registered outgrowers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MexicanLabel() {
  return (
    <div className='w-[6in] h-[4in] border-8 border-red-800 bg-[#F8DCDF]'>
      <div className='w-full h-full p-4 pb-0 text-red-800 relative'>
        <div className='h-full font-bold grid grid-cols-[1fr_75%] grid-rows-[1fr_1fr]'>
          <div className='relative mr-5 mb-5'>
            <Image
              src='/fake qr code.jpg'
              fill
              className='object-contain'
              alt='qr-code'
            />
            <span className='absolute -bottom-4 text-xs text-center text-black uppercase tracking-tight inline-block w-full'>
              Find me
            </span>
          </div>
          <div className='text-center'>
            <div
              className='text-5xl uppercase'
              style={{ fontFamily: 'fantasy' }}
            >
              Mexico
            </div>
            <div
              className='text-3xl px-6 py-1 leading- bg-red-800 text-white text-center -mr-8 w-[calc(100%+1.5rem)]  rounded-l-full'
              style={{ fontFamily: 'fantasy' }}
            >
              Red 5 de Diciembre
            </div>
            <div className='mt-1 italic text-lg'>
              Lemon, earl grey, caramel, peach, honey
            </div>
          </div>

          <div className='bg-red-800/30 text-red-900 col-span-2  border-orange-900 border-t-4 px-4 tracking-wider font-sans gap-2 grid grid-cols-[max-content_1fr] -ml-5 -mr-5 py-1 w-[calc(100%+2.5rem)] '>
            <div className='text-xl text-right'>Process:</div>
            <div className='text-xl'>Washed</div>
            <div className='text-xl text-right'>Lot:</div>
            <div>
              Red 5 de Diciembre, Eloxochitlán de Flores Magón Barrio de
              Buenavista Washed
            </div>
            <div className='text-xl text-right'>Region:</div>
            <div>Mazatec, Oaxaca, La Canada</div>
            <div className='text-xl text-right'>Varietals:</div>
            <div>Costa Rica 95, Obatã</div>
            <div className='text-xl text-right'>Altitude:</div>
            <div>1,650 meters</div>
            <div className='text-sm italic col-span-2'>
              * Traceable to 1,420 smallholders
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ColumbianLabel = () => {
  return (
    <div className='w-[6in] h-[4in] border-8 border-blue-900 bg-blue-900/10'>
      <div className='w-full h-full p-5 pb-0 text-blue-900 relative'>
        <div className='h-full font-bold grid grid-cols-[1fr_75%] grid-rows-[1fr_1fr]'>
          <div className='relative mr-5 mb-5'>
            <Image
              src='/fake qr code.jpg'
              fill
              className='object-contain'
              alt='qr-code'
            />
            <span className='absolute -bottom-4 text-xs text-center text-black uppercase tracking-tight inline-block w-full'>
              Find me
            </span>
          </div>
          <div className='text-center'>
            <div
              className='text-5xl uppercase'
              style={{ fontFamily: 'fantasy' }}
            >
              Colombia
            </div>
            <div
              className='text-3xl px-6 py-2 bg-blue-900 text-white text-center -mr-8 w-[calc(100%+1.5rem)]  rounded-l-full'
              style={{ fontFamily: 'fantasy' }}
            >
              Federacion Abades
            </div>
            <div className='mt-1 italic text-lg'>
              Red apple, quince, caramel, sugar plum
            </div>
          </div>

          <div className='bg-blue-900/30 text-blue-950 col-span-2 items-end border-blue-900 border-t-4 px-4 tracking-wider font-sans gap-2 grid grid-cols-[max-content_1fr] -ml-5 -mr-5 py-1 w-[calc(100%+2.5rem)] '>
            <div className='text-xl text-right'>Process:</div>
            <div className='text-xl'>Washed</div>
            <div className='text-xl text-right'>Lot:</div>
            <div>Federacion Abades, Samaniego Lot 9</div>
            <div className='text-xl text-right'>Region:</div>
            <div>Nariño</div>
            <div className='text-xl text-right'>Varietals:</div>
            <div>Castillo and Colombia</div>
            <div className='text-xl text-right'>Altitude:</div>
            <div>1,800 - 1,850 meters</div>
            <div className='text-sm italic col-span-2'>
              * Traceable to 206 smallholder members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
