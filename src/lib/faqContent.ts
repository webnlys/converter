/**
 * Single source for visible FAQ HTML + FAQPage JSON-LD (keep wording in sync).
 */

export type FaqBlock = {
  heading: string;
  paragraphs: string[];
};

export type FaqItem = {
  schema: { question: string; answer: string };
  blocks: FaqBlock[];
};

export const SEO_FAQ_ITEMS: FaqItem[] = [
  {
    schema: {
      question: "How do you write 125000 in words?",
      answer:
        "125000 in words is One Lakh Twenty Five Thousand Taka.",
    },
    blocks: [
      {
        heading: "How do you write 125000 in words?",
        paragraphs: [
          "125000 in words is One Lakh Twenty Five Thousand Taka.",
        ],
      },
    ],
  },
  {
    schema: {
      question: "১২৫০০০ সংখ্যাটি কথায় কীভাবে লেখা হয়?",
      answer:
        "১২৫০০০ ইংরেজিতে One Lakh Twenty Five Thousand Taka এবং বাংলায় এক লাখ পঁচিশ হাজার টাকা মাত্র।",
    },
    blocks: [
      {
        heading: "১২৫০০০ সংখ্যাটি কথায় কীভাবে লেখা হয়?",
        paragraphs: [
          "১২৫০০০ ইংরেজিতে One Lakh Twenty Five Thousand Taka এবং বাংলায় এক লাখ পঁচিশ হাজার টাকা মাত্র।",
        ],
      },
    ],
  },
  {
    schema: {
      question: "Taka in words / amount to words BD — what does it mean?",
      answer:
        "These mean turning a Bangladesh Taka figure into English (and often Bangla) words using lac/crore style. Enter the amount here to copy wording—e.g. 125000 → One Lakh Twenty Five Thousand Taka.",
    },
    blocks: [
      {
        heading: "Taka in words / amount to words BD",
        paragraphs: [
          "Direct definition: \"taka in words\" and \"amount to words bd\" mean the same job—convert BDT figures into cheque-style wording for Bangladesh.",
          "Example: 125000 → One Lakh Twenty Five Thousand Taka (English); এক লাখ পঁচিশ হাজার টাকা মাত্র (Bangla). Paste any valid amount above and copy both lines.",
        ],
      },
    ],
  },
  {
    schema: {
      question: "চেকে টাকার পরিমাণ লেখার নিয়ম কী?",
      answer:
        "চেকে সাধারণত টাকার অংক ইংরেজি ওয়ার্ডে লেখা হয়—লাখ/কোটি ও পয়সা সহ। এই টুল দিয়ে নির্ভুল ইংরেজি ও বাংলা বাক্য বানিয়ে কপি করুন, তারপর চেকে লিখুন।",
    },
    blocks: [
      {
        heading: "চেকে টাকার পরিমাণ লেখার নিয়ম",
        paragraphs: [
          "চেক ও ব্যাংক ফরমে টাকা প্রায়ই ইংরেজিতে কথায় লেখা হয় (যেমন One Lac Twenty Five Thousand Taka)। একই পরিমাণ বাংলায়ও দেখতে চাইলে এখান থেকে বাংলা লাইন কপি করে রাখুন।",
        ],
      },
    ],
  },
  {
    schema: {
      question: "Cheque lekhar niyom — how do people write amounts?",
      answer:
        "Banglish searches like \"cheque lekhar niyom\" usually mean learning how to spell the taka amount in words on a cheque—English lac/crore phrasing plus paise when needed. Generate exact lines here, then copy to your cheque.",
    },
    blocks: [
      {
        heading: "Cheque lekhar niyom",
        paragraphs: [
          "Short answer: write the taka amount in words (English wording with Lac/Crore is common on BD cheques), add paise in words if applicable, then date/signature as per bank rules. Use this converter first so spelling matches standard wording.",
        ],
      },
    ],
  },
  {
    schema: {
      question: "সংখ্যাকে ইংরেজিতে লিখুন — বাংলাদেশ টাকা",
      answer:
        "উপরের ইনপুটে সংখ্যা দিন। টুলটি ইংরেজিতে সম্পূর্ণ টাকার বাক্য দেখাবে—লাখ, কোটি ও পয়সা সহ।",
    },
    blocks: [
      {
        heading: "সংখ্যাকে ইংরেজিতে লিখুন",
        paragraphs: [
          "টাকার সংখ্যা ইংরেজি ওয়ার্ডে চাইলে নাম্বার টু টেক্সট মোডে অংক লিখুন। আউটপুটে ইংরেজি লাইন এক ক্লিকে কপি করুন।",
        ],
      },
    ],
  },
  {
    schema: {
      question: "How do I convert Bangladesh Taka amounts to words?",
      answer:
        "Enter the figure in the converter; it shows the amount in words in English and Bangla (Bengali), using lac and crore grouping common in Bangladesh.",
    },
    blocks: [
      {
        heading: "How do I convert Bangladesh Taka amounts to words?",
        paragraphs: [
          "Enter the figure in the converter; it shows the amount in words in English and Bangla (Bengali), using lac and crore grouping common in Bangladesh.",
        ],
      },
    ],
  },
  {
    schema: {
      question: "বাংলাদেশি টাকার অংক ইংরেজি ও বাংলায় কথায় কীভাবে রূপান্তর করব?",
      answer:
        "কনভার্টারে সংখ্যা লিখুন; এটি বাংলাদেশে প্রচলিত লাখ–কোটি গ্রুপিং অনুযায়ী ইংরেজি ও বাংলায় কথায় দেখাবে।",
    },
    blocks: [
      {
        heading: "বাংলাদেশি টাকার অংক ইংরেজি ও বাংলায় কথায় কীভাবে রূপান্তর করব?",
        paragraphs: [
          "কনভার্টারে সংখ্যা লিখুন; এটি বাংলাদেশে প্রচলিত লাখ–কোটি গ্রুপিং অনুযায়ী ইংরেজি ও বাংলায় কথায় দেখাবে।",
        ],
      },
    ],
  },
  {
    schema: {
      question: "Can written amounts be turned back into figures?",
      answer:
        "Yes. Use text-to-number mode to parse Bangla Taka wording into numeric amounts with formatted output.",
    },
    blocks: [
      {
        heading: "Can written amounts be turned back into figures?",
        paragraphs: [
          "Yes. Use text-to-number mode to parse Bangla Taka wording into numeric amounts with formatted output.",
        ],
      },
    ],
  },
  {
    schema: {
      question: "লেখা থেকে আবার সংখ্যায় ফেরানো যায়?",
      answer:
        "হ্যাঁ। টেক্সট-টু-নাম্বার মোডে বাংলায় লেখা টাকার পরিমাণ পার্স করে ফরম্যাটেড সংখ্যা দেখানো হয়।",
    },
    blocks: [
      {
        heading: "লেখা থেকে আবার সংখ্যায় ফেরানো যায়?",
        paragraphs: [
          "হ্যাঁ। টেক্সট-টু-নাম্বার মোডে বাংলায় লেখা টাকার পরিমাণ পার্স করে ফরম্যাটেড সংখ্যা দেখানো হয়।",
        ],
      },
    ],
  },
];
