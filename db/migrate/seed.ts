import { db, schema } from '../index';
import { sql } from 'drizzle-orm';

type Product = {
  id: number;
  name: string;
  price: number;
  size: number;
  decaf?: true;
  tastingNotes: string;
  country: string;
  region?: string;
  lot: string;
  processing: string;
  story: string;
  image: string;
};

const PRODUCTS = [
  {
    id: 1,
    name: 'Mexico Red 5 de Diciembre',
    price: 19,
    size: 12,
    tastingNotes: 'Lemon, earl grey, caramel, peach, honey',
    country: 'Mexico',
    region: 'Mazatec, Oaxaca, La Canada',
    lot: 'Red 5 de Diciembre',
    processing: 'Washed',
    image: 'https://utfs.io/f/4rrGfGgcbsJmpWC5ov9cDEfe38nUAhCrXVilm7osWzTvM65S',
    story: `The Red 5 de Diciembre network is the largest organization of producers in the La Cañada, and itself made up by 13 first-
level organizations to represent 1,300 small indigenous producers. They formed as an independant group on the 5th of

December, 2014, after La Roya devestated crops in region and chased away international buyers. Over the past six years
this group has been working to improve selective harvesting, specialty processing, and marketing of these higher value
lots. They've succeeded in growing membership and obtaining organic certification, but it was not until 2020 that they
were able to achieve and significant premiums for exporting specialty. This was the year they partnered with the cupping
team at Ensembles de Café, who worked with this group to separate out their very best and set the model for years to
come.`,
  },
  {
    id: 2,
    name: 'Sumatra Solok Radjo',
    price: 21,
    size: 12,
    tastingNotes: 'chocolate pomegeanate aroma, spritzy pear acidity, roobois',
    country: 'Sumatra',
    lot: 'Solok Radjo Honey',
    processing: 'Honey / Pulped Natural',
    image: 'https://utfs.io/f/4rrGfGgcbsJm7MxUKV2aOmgFG5AqJWQYf4C2iRu9a1BpshUX',
    story: `Solok Radjo Cooperative is made up of 500 members with 1-2 hectares each. They are a young, energetic group engaged

not only in coffee production and export, but also in roasting, visiting cafes, brewing, agronomy, and more. They have 3 Q-
certified cuppers/graders on staff and have cupping set ups at both the field location in Aie Dingin and the drying/mill

location in Solok. They are checking moisture and roasting on site to check each lot and report back to our local staff in
Medan.
The coop operates 8 collection stations across the region to reduce the distance farmers have to travel to deliver. Coop
members are paid cash upon delivery of wet parchment thanks to pre-financing of the coop thanks to our local staff and
production/export partner in Medan. This further incentivizes growing membership and participation in the group.
On the ecology front, this group is serious. They have a grant from the government to re-forest 2,000 hectares of
previously cleared land (by illegal loggers) at the border of the National Park. Protection of this forest is globally critical--
not just for carbon capture, but also for wildlife protection. Almost 40% of the world's remaining population of wild tigers
resides in this Park. Solok Radjo's initial phase included planting trees across 150 hectares. They're now expanding to
additional hectares. They are growing both shade tree/forest seedlings and coffee tree seedlings at their coop nursery,
and re-making this cleared land into forest land with coffee trees growing under the canopy. A few thousand dollars will
support a hectare. We invite roasters to get involved and support this initiative alongside Crop to Cup.`,
  },

  {
    id: 3,
    name: 'Columbian Federacion Abades',
    price: 23,
    size: 12,
    tastingNotes: 'Red apple, quince, caramel, sugar plum',
    country: 'Colombia',
    region: 'Nariño',
    lot: 'Federacion Abades, Samaniego Lot 9 Washed',
    processing: 'Washed',
    image: 'https://utfs.io/f/4rrGfGgcbsJm0L1z5aexwGYtXT8OrpP5M0aqHCvKgIS961EZ',
    story: `Abades is the name a region that covers three municipalities; Samaniego, Santacruz and Providencia. In total, there are
over 3,200 farming families in this area; many of whom are descendants of the original Pasto, Quillacinga, Abade, and
Sindagua peoples from this area. The mountainous geography of this region makes it both remote, and a central route
through which coca and coffee are traded.
Federación Abades is perhaps the most serious coffee cooperative int his region. Representing 206 families, organized
across 9 groups and into an 18 person General Assembly; yes, that means nearly 9% of members are representatives at
the assembly level.
This group was first introduced to US specialty through the 2012 Borderlands fermentation project, following which their
coffee was pre-sold every harvest for a number of years. They've grown slowly, by necessity. Each farmer has less than

one hectare, but delivers cherry to the cooperative an average of 20 - 30 times each season. Each of these nano-
deliveries are cupped and green graded to provide feedback to producers, and insight into lot separation for export. Their

goal, as a group, is to change the reputation of their region from being known for war, to being known for great coffee,
both internally and internationally.`,
  },

  {
    id: 4,
    name: 'Ethiopian Nguisse Nare',
    price: 23,
    size: 12,
    tastingNotes: 'Lavendar, plum, peach, rose water',
    processing: 'Natural',
    country: 'Ethiopia',
    region: 'Sidama Bensa Bombe',
    lot: 'Nguisse Nare, Bombe, Natural, Grade 1',
    image: 'https://utfs.io/f/4rrGfGgcbsJmKP3m3b5emFDR76qGtiaw89OurNXQlhInVvHA',
    story: `Sitting atop a ridge at 2300 MASL in Bombe, Nguisse Nare's 10 hectare farm “Setame” is planted with variety 74158
intercropped with taro and sweet potato. With his two other farms—one in Kokose, one in Tiburo—he produces natural and
anaerobic coffees using his own cherry as well as cherry collected from around 60 of his neighbors. When we visited in
December, we spoke with Thomas Tosha, the farm manager at Setame, as well
as Demisse Turuma, the Industry Manager (the term of choice for the resident postharvest processing expert) while
touring Nguisse's drying station and farm. Over a
traditional meal of enset, we learned that Nguisse bought the farm four years ago, with a strict focus on quality. He floats
his cherry before drying them slowly on raised beds over 20 days.`,
  },

  {
    id: 5,
    name: 'Ethiopian Duromina Cooperative',
    decaf: true,
    price: 21,
    size: 12,
    tastingNotes: 'chocolate babka aroma, mint, caramel, cherries',
    processing: 'Washed',
    country: 'Ethiopia',
    region: 'Limu, Agaro',
    lot: 'Duromina Cooperative Decaf',
    image: 'https://utfs.io/f/4rrGfGgcbsJm4CktK0gcbsJmSXVFtRMuW6ODhg4Exfqr71n8',
    story: `Established in 2010, 'Duromina' means 'become wealthy', and this is a smallholder cooperative who knows how to share
the wealth. First focusing on quality improvements, which earned them a name, then on an organic certification for
additional premiums, the cooperative is now focusing on community by building schools, roads, connections for
electricity and safe drinking water.
In 2009 Technoserve began working in Ethiopia, on a two-fold mission to (1) improve the value (quality) of coffees
produced and (2) to make sure the farmers of that coffee were receiving a higher percentage of the value they were
creating. Since 2009, 60+ washing stations have been created, alongside the ongoing field-work and support of
Technoserve's Jimma staff. The approach has been successful by all accounts. Farmers own their own equipment
(financed and paid down over time), they negotiate their selling prices, and pay a small commission for processing and
export (5% commission + costs). With the quality support and feedback from the Technoserve cuppers in Jimma, they
grow better coffee and keep more of the value of that coffee.
This was the work that attracted us to Western Ethiopia and that introduced us to Moata (then a Field Trainer and QC
manager for TNS). We still believe it was some of the most effective coffee work we've seen. In 2015 the funding for this
work ended and the project came to a conclusion. While many of the washing stations that were created had attracted
private specialty buyers - the coops were being mismanaged by the Oromia Union, who was only begrudgingly following
through on the original agreement it struck with these new businesses. The result was that there was great coffee coming
from these coops (Biftu, Duromina, Yukro, Nano Challa) but they were very hard for buyers to get (Ormoia Union was not
responsive), often delayed in milling and shipping, and the coops themselves were not at the table to negotiate their own
deals. The following year, they left Oromia Union, and founded the Kata Maduga Union, which was anchored by these very
successful coops.
Certainly, this was a delicate time and a real test. These farmers were at the top of their game from a processing point of
view, but running an exporter is a different ball game altogether. Furthermore, if this new Union failed, the 90 million dollar
grant and almost a decade worth of work, might be materially harmed, then disappear. It didn't fail. It's grown over the
years, it published its second payments, it has heavily reinvested in the communities that it represents and is managed by
farmers and coop leaders from the area who serve with integrity.
Kata Maduga and the coops it represents are a textbook illustration of smallholder success in specialty. Every year we
wish we could find more customers for these delicate, sweet cups - knowing the rich legacy and courageous past of these
producers who took their futures into their own hands.`,
  },

  {
    id: 6,
    name: 'Brazil Marcelo Assis',
    price: 19,
    size: 10,
    tastingNotes: 'Grapefruit, lemon liquor, cherry, chocolate',
    processing: 'Natural',
    country: 'Brazil',
    region: 'Cerrado Mineiro, Campos Altos',
    lot: 'Marcelo Assis, Fazenda Bioma Red Catuai Natural PB Lot 58',
    image: 'https://utfs.io/f/4rrGfGgcbsJmMt3lqew0WcO1YtquLMAkCBDXKiaU6PzJRp4x',
    story: `Bioma Café's is a partnership between Marcelo Nogueira Assis and Flavio Marcio Silva dating back to 2001. Flavio came
from managing the family businesses, and Marcelo was a recent graduate in the technical school of agriculture. By 2010
the two were ready to found their first coffee farm - dedicated 100% to specialty production - in Campos Altos region,
Minas Gerais. The time between was spent evaluating each piece of land that they would later buy - a scientific search
for the perfect terroir. A 1200m high plateau in Cerrado Mineiro was eventually selected, 229 hectares divided into six
zones. Olhos D'agua is the central plot, where the processing happens. For 2023, Bioma Cafe experimented with pyramid
drying on their patios in small lots, making use of wild yeasts from Selvatech.`,
  },
] satisfies Product[];

export async function seed() {
  console.log('Seeding started');
  await db.transaction(async function (tx) {
    for (const product of PRODUCTS) {
      console.log(`Seeding product: ${product.name}`);
      await tx
        .insert(schema.products)
        .values({
          id: product.id,
        })
        .onConflictDoNothing();
      const versionId = (
        await tx
          .insert(schema.productVersions)
          .values({
            productId: product.id,
            name: product.name,
            price: product.price,
            sizeOunces: product.size,
            tastingNotes: product.tastingNotes,
            story: product.story,
            image: product.image,
            processing: product.processing,
            country: product.country,
            region: product.region,
            lot: product.lot,
          })
          .returning()
      )[0]!.id;

      await tx
        .update(schema.products)
        .set({ publishedVersionId: versionId })
        .where(sql`${schema.products.id} = ${product.id}`);
    }
  });
}

async function main() {
  try {
    await seed();
    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
