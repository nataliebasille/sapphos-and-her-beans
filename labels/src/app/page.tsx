import Image from 'next/image';
export default function Home() {
  return (
    <>
      <EthiopianLabel />
      <ColumbianLabel />
    </>
  );
}

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
