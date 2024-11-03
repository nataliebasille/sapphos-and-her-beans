import Image from 'next/image';
import { coffeeDescriptions } from './coffee_descriptions';

type Coffee = (typeof coffeeDescriptions)[keyof typeof coffeeDescriptions];

export default function Home() {
  return (
    <>
      <Label {...coffeeDescriptions.Sumatra} />
      <Label {...coffeeDescriptions.Brazil} />
      <Label {...coffeeDescriptions.Colombia} />
      <Label {...coffeeDescriptions.Ethiopia} />
      <Label {...coffeeDescriptions.Mexico} />
      <Label {...coffeeDescriptions.EthiopiaDecaf} />
    </>
  );
}

const Label = (coffee: Coffee) => {
  return (
    <div
      // 5x3 inch labels
      className={`relative w-[5in] h-[3in] border-8 border-${coffee.color}-900 bg-${coffee.color}-50`}
    >
      <div
        className={`absolute top-0 right-0 bg-${coffee.color}-900 w-[48px] h-[36px] flex justify-center items-center text-${coffee.color}-50 font-bold`}
      >
        {coffee.size}oz
      </div>
      <div className='flex'>
        <div className='flex-1 p-2 flex flex-col'>
          <div className='relative w-[64px] h-[64px]'>
            <Image
              src='/fake qr code.jpg'
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
        <div style={{ fontFamily: 'fantasy' }} className='w-3/4 ml-auto'>
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

      <div
        className={`italic tracking-wide mt-3 px-2 text-center text-lg/5 font-bold text-${coffee.color}-950`}
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
          <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Varietals</div>
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
          <div className={`bg-${coffee.color}-50 px-2`}>{coffee.region}</div>
          <div className={`bg-${coffee.color}-50 px-2`}>{coffee.varietals}</div>
          <div className={`bg-${coffee.color}-50 px-2`}>{coffee.altitude}</div>
        </div>
      </div>
      <div
        className={`italic absolute bottom-0 right-0 text-xs text-right mt-1 pb-1 pr-2 tracking-wider font-serif text-${coffee.color}-950 font-bold`}
      >
        Traceable to <span>{coffee.traceable}</span>
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
