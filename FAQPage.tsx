import React from 'react';
import Accordion from './Accordion';

interface FAQItem {
  title: string;
  content: string[];
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'Security',
    items: [
      {
        title: 'Metal Detection Policy',
        content: [
          'Attendees will enter through the main entrance of the Dillo Village, located on the East Lawn of Norris. All attendees will pass through metal detecting wands upon entrance, and guests who are unable to pass through metal detectors for medical reasons may request to be screened separately in a private setting. All bags will be searched. Permitted items include empty plastic water bottles, sunscreen (non-aerosol), and compact blankets, sheets, and towels. Please allow more time for entry due to these security measures.',
          'Attendees who would like to request a separate screening, to request other accommodations for the screening process, or to ask questions about the screening process generally, can submit a Security Policies and Venue Access Information Request or call 847-467-3719.',
        ],
      },
      {
        title: 'Bag Policy',
        content: [
          'While certain bags are permitted within the festival we highly encourage those who do not need a bag to leave them at home. Individuals may bring in one (1) small personal bag, no bigger than a typical backpack. Examples include purses, drawstring bags, or camelbacks. Bigger bags will not be allowed into the festival. All bags will be searched by security prior to entering the festival. For questions, submit a Security Policies and Venue Access Information Request.',
        ],
      },
      {
        title: 'Permitted and Prohibited Items',
        content: [
          'Permitted items',
          'Prohibited items',
        ],
      },
    ],
  },
  {
    category: 'Ticketing',
    items: [
      {
        title: 'NU Undergraduate Wristband Policy',
        content: [
          'Every enrolled Northwestern University undergraduate student may receive a free festival wristband when they register for one as instructed. If you are unable to register for an NU Undergraduate wristband, submit a Wristband Registration Concern immediately.',
        ],
      },
      {
        title: 'Guest Wristband Policy',
        content: [
          'A limited number of guest wristbands for the festival will be available to undergraduates on a first-come-first-served basis at a cost of $25.00 per wristband. All students are limited to a single (1) guest wristband while quantities last. To purchase a wristband, you will need to enter the guest\'s name, date of birth, and telephone number at the time of purchase. Only purchase an additional wristband if you have your guest\'s complete information; this information cannot be changed later. An incomplete submission will result in the transaction being voided. Guests must be at least 18 years of age. No refunds, transfers, or exchanges. If any purchase is deemed fraudulent, or if an a student purchases more than one guest wristband, the tickets will be voided with no refund.',
        ],
      },
      {
        title: 'NU Graduate Wristband Policy',
        content: [
          'A limited number of wristbands will be available to current Northwestern University graduate students (including Feinberg, Pritzker, and Kellogg). The wristbands will be available on a first-come-first-served basis at a cost of $30.00 per wristband. Graduate students are limited to a single (1) wristband while quantities last. Graduate students can purchase additional guest wristbands through the extended guest option. Additionally, in order to pick up your wristband, you must come in person to the designated downtown Chicago pickup location (limited hours) or Northwestern\'s Evanston campus during the allotted distribution windows. We are unable to accommodate requests outside of these pickup windows and locations.',
        ],
      },
      {
        title: 'NU Alumni Wristband Policy',
        content: [
            'Northwestern alumni are welcome and encouraged to attend Dillo Day! Alumni will purchase a wristband through the Evanston Community and Extended Guests option at $35.00 per wristband.',
        ],
      },
      {
        title: 'Evanston Community and Extended Guests Wristband Policy',
        content: [
            'A limited number of wristbands have been set aside for purchase by Evanston residents and extended guests. These wristbands are $35.00 each. Residents and extended guests must be at least 18 years of age. Wristbands for the Evanston community and guests must be picked up prior to the day of the festival. If you foresee this to be an issue, you must submit a Wristband Pickup Concern before May 18, 2024. Otherwise, all wristbands must be picked up during normal distribution hours from May 9, 2024 through May 17, 2024. Failure to do so will not result in a refund.',

        ],
      },
      {
        title: 'Guest rules and regulations',
        content: [
            'IDs will be checked against information provided at checkout. Wristbands are not transferable and must be worn by the purchaser/registered guest. If it is determined that an individual is not the same as the one registered to the wristband on the day of the festival, the wristband will be rendered inactive and that individual will not be admitted into the festival. No refund will be given.',
        ],
      },
      {
        title: 'Wristband distribution',
        content: [
            'Attendees must pick up their wristbands in person at the scheduled locations. They must present a valid Wildcard or government-issued ID that matches the name on the wristband order. Attendees with guests are also responsible for picking up their registered guest\'s wristband during distribution. Aside from guest wristbands, no individual will be permitted to collect any other individual\'s wristbands, and will be turned away without exception.',
        ],
      },
      {
        title: 'Lost wristbands',
        content: [
            'Any replacement wristbands must be purchased from Mayfest Productions for $40.00 per replacement.',
        ],
      },
      {
        title: 'Cancellation policy',
        content: [
        'In the case of cancellation due to inclement weather or other emergency, there are no refunds given. Mayfest Productions has the sole discretion as to any exceptions to this and appeals will be heard on a case-by-case basis. To submit formal requests for exceptions, please submit a Cancellation Policy Exemption Request.',
    ],
      },
    ],
  },
  {
    category: 'Accessibility',
    items: [
      {
        title: 'Accessibility policy',
        content: [
          'Individuals seeking reasonable accommodations related to accessibility and/or mobility needs on Dillo Day are encouraged to reach out to Mayfest in order to arrange appropriate festival accommodations. Mayfest cannot guarantee accommodations, and our Accessibility Team will review requests on a case-by-case basis. When ordering a wristband, fill out the accessibility requests with your needs. Any questions or concerns related to accessibility can be relayed to Mayfest with an Accessibility Request.',
        ],
      },
      {
        title: 'Medication policy',
        content: [
          'Prescription medication is allowed within the festival grounds. To bring in prescription medication, the individual must bring with them the pharmacy-labeled container, which details the prescription, dosage, and patient name. Individuals are only allowed to bring enough supply of medication for that day. Medications needed to be inhaled or smoked are prohibited unless in a prescribed inhaler.',
          'Over-the-counter medications such as Dayquil, acetaminophen, antacids, or antihistamines, can be brought into the festival with only a sufficient amount for the day.',
        ],
      },
    ],
  },
  {
    category: 'Acknowledgements',
    items: [
      {
        title: 'Land Acknowledgement',
        content: [
          'The location of today\'s Dillo Day, the Northwestern Lakefill, is on the homelands of the people of the Council of Three Fires, the Ojibwe, Potawatomi, and Odawa as well as the Menominee, Miami and Ho-Chunk nations. Mayfest Productions believes providing more context is essential given this year\'s theme, Camp Dillo. The theme of summer camps often invokes racist Native American tropes and mascots, while also creating a colonial dichotomy between “nature” vs. “civilization” that stems from Native American genocide and white supremacy. Mayfest Productions acknowledges that summer camps often serve as a site of Indigenous appropriation, and commits to rejecting discriminatory tropes and imagery. Since the origin of summer camp, campers and camp organizations have engaged in caricatured, stolen Indigenous traditions, like hosting powwows and appropriating Native cultures within their programming (cabins are “tribes,” camp directors are “Chiefs”) or camp names.',
          'Northwestern is also in close proximity to an urban Indigenous community in Chicago and near several tribes in the Midwest. Pre-colonization, the Indigenous communities in the area had established a vast network of trails and portages, or places to carry and drag boats from one water system to another, and had a robust trading network. By 1833, most Indigenous communities were displaced from the region after they were pressured to sign a series of coercive treaties. The 1833 Treaty of Chicago, which was taken as a surrender to Indigenous peoples\' claims to Chicagoland, was signed before the creation of Northwestern\'s lakefill in 1962-1964. The Pokagon Band of Potawatomi laid claim to this land east of Michigan Avenue created by landfill in the 1980s and thereafter. For the Ojibwe, Potawatomi, and Odawa—the Council of Three Fires—Lake Michigan is not just a body of water but a vital cultural, spiritual, and economic resource. Native peoples have historically depended on the Great Lakes for transportation, sustenance, trade, and ceremonial purposes, viewing them as sacred spaces with significant spiritual importance. The creation of the lakefill altered these traditional and sacred spaces. This act changed the natural shoreline and disrupted the ecological balance of the area. So, as we convene on the university\'s lakefill, we encourage you to reflect on its history and relationship with the original stewards of this land.',
          'The ongoing and current oppression of Indigenous peoples persists today globally. Generations of government policies of forced removal, land seizures and violence have been inflicted on Native peoples. Food insecurity and poverty are high among Native communities today, at roughly double the rate of white Americans. On the Northwestern campus alone, the John Evans Center is named after one of Northwestern\'s founders John Evans, who had direct involvement in the Sand Creek Massacre, the mass murder of Cheyenne and Arapaho people. According to a report conducted by the University of Denver, Evans\'s actions as the territorial governor of Colorado, such as violence-inciting proclamations and neglect of treaty-negotiation duties, set the conditions for a massacre to occur. Northwestern continues to develop on stolen land; The Pokagon Band of the Potawatomi Indians Tribal Historic Preservation Office wrote to the City of Evanston and Northwestern over concerns of the new Ryan Field construction and its disturbance of ancestral burials and archaeologically sensitive sites, as seen on Evanston\'s Land Use Commission\'s website. Northwestern has yet to acknowledge if archaeological oversight will take place during construction.',
          'We would like to use this opportunity to urge non-Native attendees to educate themselves about the ongoing struggles Indigenous communities face today as a result of past and contemporary colonial projects, including those perpetrated by the Northwestern University Board of Trustees. We have included a list of resources and links to pages to learn more about the current issues Native communities are suffering from. We urge you to learn about and support Indigenous-led movements meant to combat colonial oppression, such as the Land Back Movement.',
          'Finally, to expand our action beyond statements, Mayfest Productions is encouraging Mayfest members and all Northwestern community members to attend the NAISA Spring Pow Wow on April 27th, an effort that aligns with our commitment to supporting meaningful community initiatives. We also encourage students to attend the Center for Native American and Indigenous Research and Office of Institutional Diversity and Inclusion\'s Lunch & Learn and accompanying Q&A hosted by Dave Spencer (Mississippi Chata/Diné) from Oka Homma Singers on April 25th to prepare for attending the Pow Wow. Your participation will help contribute directly to the knowledge of the history of this land.',
        ],
      },
    ],
  },
];



const FAQPage: React.FC = () => {
  return (
    <div style={pageStyles.container}>
      <h1 style={pageStyles.header}>Coachella FAQ</h1>
      {FAQ_DATA.map((faqCategory, idx) => (
        <div key={idx} style={pageStyles.categorySection}>
          <h2 style={pageStyles.categoryTitle}>{faqCategory.category}</h2>
          {faqCategory.items.map((item, itemIdx) => (
            <Accordion key={itemIdx} title={item.title}>
              {item.content.map((paragraph, pIdx) => (
                <p key={pIdx} style={{ margin: '0.5rem 0' }}>
                  {paragraph}
                </p>
              ))}
            </Accordion>
          ))}
        </div>
      ))}
    </div>
  );
};

const pageStyles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '1rem',
    fontFamily: 'sans-serif',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  categorySection: {
    marginBottom: '2rem',
  },
  categoryTitle: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    borderBottom: '1px solid #ccc',
    paddingBottom: '0.5rem',
  },
};

export default FAQPage;