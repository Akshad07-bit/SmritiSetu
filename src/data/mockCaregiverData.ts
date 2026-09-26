/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ClinicalCognitiveSummary,
  FamilyMemoryItem,
  GameSessionResult,
  MedicationRoutineItem,
} from '../types';

export const INITIAL_FAMILY_MEMORIES: FamilyMemoryItem[] = [
  {
    id: 'mem-1',
    title: 'Aita with Granddaughter Priyakshi in Courtyard',
    relation: 'Granddaughter',
    personName: 'Priyakshi Borah',
    location: 'Ancestral home courtyard',
    yearApprox: 'Circa 2012',
    description: 'Sitting together in the golden morning sunlight, sharing stories and teaching Priyakshi how to spin silk yarn. She is now 22 and studying medicine.',
    audioPromptHint: 'Priyakshi called yesterday to ask about your health and sent you her warmest love.',
    imageSrc: '/src/assets/images/ne_family_memory_1790407141661.jpg',
    aiStory: 'On this golden morning, the courtyard was filled with laughter. Priyakshi sat beside you listening to stories of old times. Your gentle guidance shaped her path, and she holds this memory close to her heart every single day.',
    translations: {
      en: {
        title: 'With Granddaughter Priyakshi in the Courtyard',
        relation: 'Granddaughter',
        location: 'Ancestral home courtyard',
        description: 'Sitting together in the golden morning sunlight, sharing stories and teaching Priyakshi how to spin silk yarn. She is now 22 and studying medicine.',
        audioPromptHint: 'Priyakshi called yesterday to ask about your health and sent you her warmest love.',
        aiStory: 'On this golden morning, the courtyard was filled with laughter. Priyakshi sat beside you listening to stories of old times. Your gentle guidance shaped her path, and she holds this memory close to her heart every single day.',
      },
      hi: {
        title: 'आंगन में पोती प्रियक्षी के साथ सुखद पल',
        relation: 'पोती (प्रियक्षी)',
        location: 'पुश्तैनी घर का खुला आंगन',
        description: 'सुबह की सुनहरी धूप में साथ बैठकर प्रियक्षी को पुरानी कहानियां सुनाना और सूत कातना सिखाना। वह आज डॉक्टर बनने की पढ़ाई कर रही है।',
        audioPromptHint: 'प्रियक्षी ने कल फोन करके आपका हालचाल पूछा था और ढेर सारा प्यार भेजा है।',
        aiStory: 'इस खिली हुई सुबह पर घर का आंगन हंसी और खुशी से गूंज रहा था। प्रियक्षी आपके पास बैठकर आपकी बातें सुन रही थी। आपके दिए संस्कार हमेशा उसके दिल में बसे हैं।',
      },
      mr: {
        title: 'अंगणात नात प्रियक्षीसोबत घालवलेले गोड क्षण',
        relation: 'नात (प्रियक्षी)',
        location: 'वडिलोपार्जित घराचे मोकळे अंगण',
        description: 'सकाळच्या कोवळ्या उन्हात एकत्र बसून प्रियक्षीला जुन्या गोष्टी सांगणे आणि विणकाम शिकवणे. ती आता वैद्यकीय शिक्षण घेत आहे.',
        audioPromptHint: 'प्रियक्षीने काल फोन करून आपल्या प्रकृतीची चौकशी केली आणि खूप प्रेम पाठवले आहे.',
        aiStory: 'त्या प्रसन्न सकाळी अंगणात आनंदाचे वातावरण होते. प्रियक्षी आपल्याजवळ बसून कौतुकाने जुन्या गोष्टी ऐकत होती. आपले प्रेम आणि आशीर्वाद तिच्या सदैव पाठीशी आहेत.',
      },
    },
  },
  {
    id: 'mem-2',
    title: 'Morning Stroll in the Green Garden Mist',
    relation: 'Eldest Son',
    personName: 'Bhaskar Borah',
    location: 'Tea garden trail',
    yearApprox: '1988',
    description: 'Walking along the tranquil tea rows with Bhaskar early in the morning when the fresh tea leaves were fragrant with morning dew.',
    audioPromptHint: 'You always loved the aroma of freshly roasted green tea leaves after rain.',
    imageSrc: '/src/assets/images/ne_reminiscence_tea_garden_1790407105183.jpg',
    aiStory: 'The rolling tea hills stretched endlessly under the morning mist. With pickers singing softly in the distance, you walked along the quiet path, feeling peaceful, steady, and at home among the greenery.',
    translations: {
      en: {
        title: 'Morning Stroll in the Green Garden Mist',
        relation: 'Eldest Son',
        location: 'Tea garden trail',
        description: 'Walking along the tranquil tea rows with Bhaskar early in the morning when the fresh tea leaves were fragrant with morning dew.',
        audioPromptHint: 'You always loved the aroma of freshly roasted green tea leaves after rain.',
        aiStory: 'The rolling tea hills stretched endlessly under the morning mist. With pickers singing softly in the distance, you walked along the quiet path, feeling peaceful, steady, and at home among the greenery.',
      },
      hi: {
        title: 'हरी-भरी वादियों में सुबह की शांत सैर',
        relation: 'बड़ा बेटा (भास्कर)',
        location: 'चाय बागान का शांत रास्ता',
        description: 'भास्कर के साथ सुबह की ठंडी हवा में घूमना, जब चाय की ताजी पत्तियों पर ओस की बूंदें चमक रही थीं।',
        audioPromptHint: 'बारिश के बाद ताजी चाय की खुशबू आपको हमेशा बहुत पसंद रही है।',
        aiStory: 'सुबह के हल्के कोहरे में फैली हरी-भरी पहाड़ियों के बीच आप शांति से टहल रहे थे। दूर से आती चिड़ियों की चहचहाहट मन को अपार सुकून दे रही थी।',
      },
      mr: {
        title: 'हिरव्यागार निसर्गात सकाळचा शांत फेरफटका',
        relation: 'मोठा मुलगा (भास्कर)',
        location: 'हिरव्यागार बागेतील पाऊलवाट',
        description: 'भास्करसोबत पहाटेच्या सुखद गारव्यात चालणे, जेव्हा पानांवर दवाचे थेंब मोत्यांसारखे चमकत होते.',
        audioPromptHint: 'पावसानंतर ताज्या पानांचा मंद सुगंध आपल्याला नेहमीच खूप आवडायचा.',
        aiStory: 'धुक्याची चादर पांघरलेल्या हिरव्या टेकड्यांवरून भास्करसोबत चालताना मन अतिशय शांत आणि प्रसन्न होते. ही शांतता आजही आपल्या मनात घर करून आहे.',
      },
    },
  },
  {
    id: 'mem-3',
    title: 'Festive Family Gathering & Sacred Blessings',
    relation: 'Whole Family Gathering',
    personName: 'Beloved Family',
    location: 'Family residence veranda',
    yearApprox: 'Festive Season 2019',
    description: 'The whole family touched your feet and presented you with handcrafted woven scarves and homemade sweets to seek your blessings.',
    audioPromptHint: 'Your children and grandchildren were all home together, sharing festive sweets and laughter.',
    imageSrc: '/src/assets/images/ne_cultural_artifacts_1790407120815.jpg',
    aiStory: 'On this joyous festive day, traditional sweets and honors were placed in your hands with deep reverence. Laughter and songs resonated through the home, surrounded by three generations of family who love you dearly.',
    translations: {
      en: {
        title: 'Festive Family Gathering & Sacred Blessings',
        relation: 'Whole Family Gathering',
        location: 'Family residence veranda',
        description: 'The whole family touched your feet and presented you with handcrafted woven scarves and homemade sweets to seek your blessings.',
        audioPromptHint: 'Your children and grandchildren were all home together, sharing festive sweets and laughter.',
        aiStory: 'On this joyous festive day, traditional sweets and honors were placed in your hands with deep reverence. Laughter and songs resonated through the home, surrounded by three generations of family who love you dearly.',
      },
      hi: {
        title: 'त्योहार पर पूरे परिवार का स्नेह मिलन',
        relation: 'पूरा परिवार',
        location: 'घर का खुला बरामदा',
        description: 'त्योहार के पावन अवसर पर बच्चों ने आपके चरण छूकर आशीर्वाद लिया और घर में बनी पारंपरिक मिठाइयां बांटी।',
        audioPromptHint: 'आपके बेटे, बेटी और नाती-पोते सभी घर आए थे और मिलकर खुशियां मना रहे थे।',
        aiStory: 'त्योहार की इस पावन बेला पर सभी ने श्रद्धा से आपका आशीर्वाद लिया। घर में मधुर गीत और हंसी गूंज रही थी, और पूरा परिवार आपके स्नेह की छाया में सुरक्षित था।',
      },
      mr: {
        title: 'सणासुदीला संपूर्ण कुटुंबाचा स्नेहमेळावा',
        relation: 'संपूर्ण कुटुंब',
        location: 'घराची सुंदर बाल्कनी व दिवाणखाना',
        description: 'सणाच्या मंगल दिवशी सर्वांनी आपल्या पाया पडून आशीर्वाद घेतले आणि घरात तयार केलेले पारंपरिक गोडधोड पदार्थ वाटले.',
        audioPromptHint: 'मुलगा, मुलगी आणि नातवंडे सगळे एकत्र येऊन सणाचा गोडवा द्विगुणित करत होते.',
        aiStory: 'सणाच्या या पवित्र दिवशी सर्वांनी अत्यंत आदराने आपल्या चरणांवर मस्तक टेकवले. घरात आनंदाचे सूर गुंजत होते आणि तीन पिढ्यांचे प्रेम आपल्याभोवती दाटून आले होते.',
      },
    },
  },
];

export const INITIAL_MEDICATIONS: MedicationRoutineItem[] = [
  {
    id: 'med-1',
    name: 'Donepezil (Aricept) 5mg',
    timeSlot: 'Morning',
    timeLabel: '08:30 AM',
    dose: '1 tablet with warm milk',
    instructions: 'Cognitive memory support, taken after light breakfast',
    takenToday: true,
    elderIcon: '🌅',
    translations: {
      en: {
        name: 'Donepezil 5mg (Memory Support)',
        dose: '1 tablet with warm milk',
        instructions: 'Memory support, taken after light breakfast',
        timeSlotLabel: 'Morning',
      },
      hi: {
        name: 'डोनेपेजिल ५ मि.ग्रा. (स्मृति सहारा)',
        dose: '१ गोली गुनगुने दूध के साथ',
        instructions: 'याददाश्त के लिए, सुबह हल्के नाश्ते के बाद लें',
        timeSlotLabel: 'सुबह',
      },
      mr: {
        name: 'डोनेपेझिल ५ मि.ग्रॅ. (स्मृती आधार)',
        dose: '१ गोळी कोमट दुधासोबत',
        instructions: 'स्मरणशक्तीसाठी, सकाळी हलक्या नाश्त्यानंतर घ्या',
        timeSlotLabel: 'सकाळ',
      },
    },
  },
  {
    id: 'med-2',
    name: 'Telmisartan 40mg (Blood Pressure)',
    timeSlot: 'Morning',
    timeLabel: '09:00 AM',
    dose: '1 tablet with water',
    instructions: 'Blood pressure maintenance',
    takenToday: true,
    elderIcon: '💊',
    translations: {
      en: {
        name: 'Telmisartan 40mg (Blood Pressure)',
        dose: '1 tablet with water',
        instructions: 'Blood pressure maintenance',
        timeSlotLabel: 'Morning',
      },
      hi: {
        name: 'टेल्मीसार्टन ४० मि.ग्रा. (रक्तचाप)',
        dose: '१ गोली सादे पानी के साथ',
        instructions: 'रक्तचाप सामान्य बनाए रखने के लिए',
        timeSlotLabel: 'सुबह',
      },
      mr: {
        name: 'टेल्मीसार्टन ४० मि.ग्रॅ. (रक्तदाब)',
        dose: '१ गोळी साध्या पाण्यासोबत',
        instructions: 'रक्तदाब नियंत्रित ठेवण्यासाठी',
        timeSlotLabel: 'सकाळ',
      },
    },
  },
  {
    id: 'med-3',
    name: 'Hydration & Tulsi Ginger Warm Water',
    timeSlot: 'Afternoon',
    timeLabel: '01:30 PM',
    dose: '1 warm cup (250ml)',
    instructions: 'Essential hydration for cognitive focus and digestion',
    takenToday: false,
    elderIcon: '🍵',
    translations: {
      en: {
        name: 'Tulsi & Ginger Warm Water',
        dose: '1 warm cup (250ml)',
        instructions: 'Gentle hydration for digestive and mental calm',
        timeSlotLabel: 'Afternoon',
      },
      hi: {
        name: 'तुलसी व अदरक का गुनगुना पानी',
        dose: '१ कप (२५० मि.ली.)',
        instructions: 'शरीर में ताजगी और मानसिक शांति के लिए',
        timeSlotLabel: 'दोपहर',
      },
      mr: {
        name: 'तुळस आणि आल्याचे कोमट पाणी',
        dose: '१ कप (२५० मि.ली.)',
        instructions: 'पचनासाठी आणि मनाच्या शांततेसाठी',
        timeSlotLabel: 'दुपार',
      },
    },
  },
  {
    id: 'med-4',
    name: 'Memantine 5mg',
    timeSlot: 'Evening',
    timeLabel: '07:30 PM',
    dose: '1 tablet after evening snack',
    instructions: 'Neuroprotective support before night rest',
    takenToday: false,
    elderIcon: '🌙',
    translations: {
      en: {
        name: 'Memantine 5mg',
        dose: '1 tablet after evening snack',
        instructions: 'Neuroprotective support before night rest',
        timeSlotLabel: 'Evening',
      },
      hi: {
        name: 'मेमान्टिन ५ मि.ग्रा.',
        dose: '१ गोली शाम के हल्के नाश्ते के बाद',
        instructions: 'रात के आराम से पहले तंत्रिका सुरक्षा हेतु',
        timeSlotLabel: 'शाम',
      },
      mr: {
        name: 'मेमॅन्टिन ५ मि.ग्रॅ.',
        dose: '१ गोळी संध्याकाळच्या चहा/नाश्त्यानंतर',
        instructions: 'रात्रीच्या शांत झोपेपूर्वी मेंदूच्या आरोग्यासाठी',
        timeSlotLabel: 'संध्याकाळ',
      },
    },
  },
];

export const INITIAL_GAME_HISTORY: GameSessionResult[] = [
  {
    id: 'hist-1',
    gameId: 'heritage-match',
    gameName: 'Heritage Match',
    score: 6,
    totalQuestionsOrPairs: 6,
    accuracyPercent: 92,
    durationSeconds: 94,
    timestamp: '2026-09-25 09:40',
    cognitiveDomain: 'Visuospatial',
  },
  {
    id: 'hist-2',
    gameId: 'sound-recall',
    gameName: 'Sensory Sound Recall',
    score: 4,
    totalQuestionsOrPairs: 4,
    accuracyPercent: 100,
    durationSeconds: 78,
    timestamp: '2026-09-24 16:15',
    cognitiveDomain: 'Auditory Recall',
  },
  {
    id: 'hist-3',
    gameId: 'daily-routine',
    gameName: 'Daily Routine Sequencer',
    score: 5,
    totalQuestionsOrPairs: 5,
    accuracyPercent: 80,
    durationSeconds: 110,
    timestamp: '2026-09-23 10:20',
    cognitiveDomain: 'Executive Sequencing',
  },
  {
    id: 'hist-4',
    gameId: 'folk-wisdom',
    gameName: 'Folk Tale & Word Wisdom',
    score: 4,
    totalQuestionsOrPairs: 4,
    accuracyPercent: 100,
    durationSeconds: 65,
    timestamp: '2026-09-22 17:00',
    cognitiveDomain: 'Semantic Memory',
  },
];

export const INITIAL_CLINICAL_SUMMARY: ClinicalCognitiveSummary = {
  overallStabilityScore: 82,
  domainScores: {
    visuoSpatial: 88,
    shortTermRecall: 76,
    executiveSequencing: 79,
    auditoryAttention: 85,
  },
  clinicalSummary:
    'Patient demonstrates resilient long-term autobiographical recall when stimulated with culturally rooted memory anchors. Visuospatial card matching remains strong with low hesitation time. No acute signs of evening sundowning observed during the past 7 days.',
  sundowningRisk: 'Low',
  caregiverRecommendations: [
    'Schedule morning cognitive stimulation sessions between 9:00 AM and 10:30 AM when alertness peaks.',
    'Play rain or flute soundscapes at 4:30 PM twilight to provide a soothing sensory anchor.',
    'Reinforce family identities using the Loved Ones memory album twice weekly.',
  ],
  translations: {
    en: {
      clinicalSummary:
        'Patient demonstrates resilient long-term autobiographical recall when stimulated with culturally rooted memory anchors. Visuospatial card matching remains strong with low hesitation time. No acute signs of evening sundowning observed during the past 7 days.',
      sundowningRisk: 'Low',
      caregiverRecommendations: [
        'Schedule morning cognitive stimulation sessions between 9:00 AM and 10:30 AM when alertness peaks.',
        'Play rain or flute soundscapes at 4:30 PM twilight to provide a soothing sensory anchor.',
        'Reinforce family identities using the Loved Ones memory album twice weekly.',
      ],
    },
    hi: {
      clinicalSummary:
        'पारंपरिक व सांस्कृतिक यादों से जुड़ने पर बुजुर्ग की दीर्घकालिक स्मृति बहुत सकारात्मक और सक्रिय रहती है। कार्ड मिलान में दृश्य स्मृति बहुत अच्छी है और निर्णय लेने में झिझक कम है। पिछले ७ दिनों में शाम की बेचैनी (सनडाऊनिंग) का कोई लक्षण नहीं देखा गया।',
      sundowningRisk: 'कम (सुरक्षित)',
      caregiverRecommendations: [
        'सुबह ९:०० से १०:३० के बीच मनोरंजक खेल खिलाएं, इस समय मानसिक सजगता सबसे अधिक होती है।',
        'शाम ४:३० बजे गोधूलि वेला में बारिश या बांसुरी की शांत धुन बजाएं जिससे मन शांत रहे।',
        'हफ्ते में दो बार प्रियजनों की फोटो एलबम दिखाकर परिवार के रिश्तों को ताजा करें।',
      ],
    },
    mr: {
      clinicalSummary:
        'पारंपरिक आणि सांस्कृतिक आठवणी जाग्या केल्यावर आजींची जुनी स्मरणशक्ती अतिशय उत्तम आणि सकारात्मक प्रतिसाद देते. कार्ड जोड्या जुळवताना दृश्य ओळख अचूक आहे. गेल्या ७ दिवसांत संध्याकाळच्या वेळी कोणतीही अस्वस्थता (सनडाऊनिंग) आढळली नाही.',
      sundowningRisk: 'कमी (सुरक्षित)',
      caregiverRecommendations: [
        'सकाळी ९:०० ते १०:३० या वेळेत मनाचे खेळ खेळा, या वेळी उत्साह सर्वाधिक असतो.',
        'संध्याकाळी ४:३० वाजता सूर्य मावळताना पाऊस किंवा बासरीचे मंजुळ सूर लावून वातावरण शांत ठेवा.',
        'आठवड्यातून दोनदा कुटुंबियांचे छायाचित्र अल्बम दाखवून नात्यांची गोड आठवण जागी ठेवा.',
      ],
    },
  },
};
