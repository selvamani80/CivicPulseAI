export const translations = {
  en: {
    appTitle: "CivicPulse AI",
    appTagline: "Predicting Community Problems Before They Become Emergencies",
    taglineSub: "Detecting weak signals, clustering citizen reports, and forecasting emerging civic risks across Tamil Nadu & Indian communities.",
    
    // Roles
    roleCitizen: "Citizen",
    roleFieldOfficer: "Field Officer",
    roleDeptOfficer: "Department Officer",
    roleAdmin: "Administrator",
    roleAIAnalyst: "AI / ML Analyst",

    // Navigation
    navOverview: "Overview",
    navReport: "Report Problem",
    navPredictionMap: "Prediction Map",
    navActiveRisks: "Active Risks",
    navAnalytics: "AI Analytics & MLOps",
    navAdmin: "Admin Panel",
    navDocs: "System Docs",

    // Citizen buttons
    btnVoiceReport: "Report by Voice (Tamil / Tanglish)",
    btnPhotoReport: "Report with Photo",
    btnTextReport: "Report by Text",
    btnNearbyProblems: "Report Nearby Problem",
    btnPredictNext24: "Predict Next 24 Hours",
    btnSimulateSurge: "Run Live Surge Simulation",

    // Citizen Form
    formTitle: "Submit Civic Signal",
    formDescPlaceholder: "e.g., Road la romba water nikkuthu bus stop pakkathula or தமிழ்: தண்ணீர் தேங்கி உள்ளது",
    formCategory: "Category",
    formSeverity: "Severity Level",
    formLocation: "Location / Ward",
    formAnonymous: "Submit Anonymously",
    formSubmit: "Submit Report",
    formUploading: "Analyzing Signal...",
    
    // Auth & Gateway
    authRequiredTitle: "Sign In Required",
    authRequiredDesc: "Please Sign In or Create an Account using Firebase to access reporting, officer dispatches, and AI predictions.",
    btnSignIn: "Sign In",
    btnSignUp: "Create Account",
    btnSignOut: "Sign Out",
    welcomeUser: "Welcome",

    // Status badges
    statusAiPredicted: "AI PREDICTION",
    statusUnverified: "UNVERIFIED",
    statusFieldVerified: "FIELD VERIFIED",
    statusResolved: "RESOLVED & PREVENTED",
    statusFalsePositive: "FALSE POSITIVE",

    // Categories
    catWaterlogging: "Waterlogging",
    catFloodRisk: "Flood Risk",
    catGarbage: "Garbage Accumulation",
    catRoadDamage: "Road Damage",
    catPothole: "Pothole",
    catDrainage: "Drainage Blockage",
    catStreetlight: "Streetlight Failure",
    catWaterSupply: "Water Supply Issue",
    catSewage: "Sewage Overflow",
    catTree: "Fallen Tree",
    catTraffic: "Traffic Obstruction",

    // Analytics & Risk
    riskLevelHigh: "HIGH RISK",
    riskLevelCritical: "CRITICAL RISK",
    riskLevelMedium: "MODERATE RISK",
    riskLevelLow: "LOW RISK",
    contributingFactors: "Contributing Risk Factors (SHAP Analysis)",
    recommendedAction: "Recommended Advisory Action",
    confidenceScore: "Confidence Score",
    leadTimeSaved: "Early Warning Lead Time",
    precision: "Precision",
    recall: "Recall",
    f1Score: "F1 Score",
    rocAuc: "ROC-AUC Score",
    modelDrift: "Model Drift Status",

    // Regional Cities
    madurai: "Madurai",
    karaikudi: "Karaikudi",
    devakottai: "Devakottai",
    trichy: "Trichy",

    // Actions
    btnVerify: "Confirm Prediction",
    btnDismiss: "Flag False Positive",
    btnAssign: "Assign Maintenance Team",
    btnRecordAction: "Record Preventive Action",
    
    // Voice UI
    recordingTitle: "Speak in Tamil, Tanglish, or English",
    recordingDesc: "e.g. 'Goripalayam junction Madurai la water stagnation heavy ah irukku'",
    recordingStart: "Start Recording",
    recordingStop: "Stop & Process",
    
    // Photo UI
    photoQualityCheck: "Image Quality Inspection",
    photoClear: "Image clear and usable for computer vision",
    photoBlurry: "Image quality insufficient. Please upload a clearer photo.",
  },
  ta: {
    appTitle: "சிவிக்பல்ஸ் AI (CivicPulse AI)",
    appTagline: "சமூகப் பிரச்சினைகள் அவசரநிலையாக மாறுவதற்கு முன்பே கணித்தல்",
    taglineSub: "மதுரை, காரைக்குடி, தேவகோட்டை, திருச்சி மற்றும் தமிழக நகரங்களில் சிறிய சிக்னல்களைக் கண்டறிந்து, ஆபத்துகளை முன்னரே கணிக்கிறது.",

    // Roles
    roleCitizen: "குடிமகன் (Citizen)",
    roleFieldOfficer: "கள அதிகாரி (Field Officer)",
    roleDeptOfficer: "துறை அதிகாரி (Dept Officer)",
    roleAdmin: "நிர்வாகி (Admin)",
    roleAIAnalyst: "AI ஆய்வாளர் (AI Analyst)",

    // Navigation
    navOverview: "முக்கிய பார்வைகள்",
    navReport: "புகார் பதிவு செய்க",
    navPredictionMap: "கணிப்பு வரைபடம் (Map)",
    navActiveRisks: "தற்போதைய ஆபத்துகள்",
    navAnalytics: "AI பகுப்பாய்வு",
    navAdmin: "நிர்வாக குழு",
    navDocs: "ஆவணங்கள்",

    // Citizen buttons
    btnVoiceReport: "குரல் மூலம் புகார் (Voice Report)",
    btnPhotoReport: "கேமரா புகைப்படத்துடன் புகார்",
    btnTextReport: "எழுத்து மூலம் புகார்",
    btnNearbyProblems: "அருகிலுள்ள பிரச்சனைகள்",
    btnPredictNext24: "அடுத்த 24 மணி நேர கணிப்பு",
    btnSimulateSurge: "நேரலை உருவகப்படுத்துதல்",

    // Citizen Form
    formTitle: "சமூகப் பிரச்சனை பதிவு செய்க",
    formDescPlaceholder: "எ.கா: மதுரை கோரிப்பாளையம் ரவுண்டானாவில் சாக்கடை நீர் தேங்கி நிற்கிறது",
    formCategory: "வகைப்பாடு",
    formSeverity: "தீவிர நிலை",
    formLocation: "இடம் / வார்டு",
    formAnonymous: "பெயர் இன்றி அனுப்பவும்",
    formSubmit: "புகார் பதிவு செய்க",
    formUploading: "AI பகுப்பாய்வு செய்கிறது...",

    // Auth & Gateway
    authRequiredTitle: "உள்நுழைவு அவசியம் (Sign In Required)",
    authRequiredDesc: "புகார்களைப் பதிவுசெய்யவும், AI கணிப்புகளைப் பார்வையிடவும் தயவுசெய்து உள்நுழையவும் அல்லது கணக்கு உருவாக்கவும்.",
    btnSignIn: "உள்நுழைக (Sign In)",
    btnSignUp: "கணக்கு தொடங்க (Sign Up)",
    btnSignOut: "வெளியேறு (Sign Out)",
    welcomeUser: "வரவேற்கிறோம்",

    // Status badges
    statusAiPredicted: "AI கணிப்பு",
    statusUnverified: "சரிபார்க்கப்படவில்லை",
    statusFieldVerified: "களத்தில் உறுதிசெய்யப்பட்டது",
    statusResolved: "தடுக்கப்பட்டு சரிசெய்யப்பட்டது",
    statusFalsePositive: "தவறான கணிப்பு",

    // Categories
    catWaterlogging: "தண்ணீர் தேங்குதல் (Waterlogging)",
    catFloodRisk: "வெள்ள ஆபத்து (Flood Risk)",
    catGarbage: "குப்பை சேருதல்",
    catRoadDamage: "சாலை சேதம்",
    catPothole: "சாலைக் குழி (Pothole)",
    catDrainage: "கழிவுநீர் அடைப்பு",
    catStreetlight: "தெருவிளக்கு பழுது",
    catWaterSupply: "குடிநீர் பிரச்சனை",
    catSewage: "சாக்கடை வழிதல்",
    catTree: "மரம் விழுதல்",
    catTraffic: "போக்குவரத்து நெரிசல்",

    // Analytics & Risk
    riskLevelHigh: "அதிக ஆபத்து (High Risk)",
    riskLevelCritical: "மிக அவசர ஆபத்து (Critical)",
    riskLevelMedium: "மிதமான ஆபத்து",
    riskLevelLow: "குறைந்த ஆபத்து",
    contributingFactors: "காரணிகள் (SHAP Factors)",
    recommendedAction: "பரிந்துரைக்கப்பட்ட தடுப்பு நடவடிக்கை",
    confidenceScore: "நம்பகத்தன்மை",
    leadTimeSaved: "முன்னெச்சரிக்கை நேரம்",
    precision: "துல்லியம் (Precision)",
    recall: "மீட்டெடுப்பு (Recall)",
    f1Score: "F1 மதிப்பெண்",
    rocAuc: "ROC-AUC மதிப்பெண்",
    modelDrift: "மாடல் நிலைத்தன்மை",

    // Regional Cities
    madurai: "மதுரை (Madurai)",
    karaikudi: "காரைக்குடி (Karaikudi)",
    devakottai: "தேவகோட்டை (Devakottai)",
    trichy: "திருச்சி (Trichy)",

    // Actions
    btnVerify: "உறுதி செய்",
    btnDismiss: "தவறு என நிராகரி",
    btnAssign: "குழுவை அனுப்பு",
    btnRecordAction: "தடுப்பு நடவடிக்கையை பதிவு செய்",

    // Voice UI
    recordingTitle: "தமிழ், தங்க்லீஷ் அல்லது ஆங்கிலத்தில் பேசவும்",
    recordingDesc: "எ.கா: 'மதுரை கோரிப்பாளையம் சந்திப்பில் கழிவுநீர் அடைப்பு அதிகமாக உள்ளது'",
    recordingStart: "பேசத் தொடங்கவும்",
    recordingStop: "நிறுத்தி பகுப்பாய்வு செய்",

    // Photo UI
    photoQualityCheck: "படத்தின் தரம் ஆய்வு",
    photoClear: "படம் தெளிவாக உள்ளது. AI ஆய்வு செய்ய முடியும்.",
    photoBlurry: "படம் தெளிவாக இல்லை. தயவுசெய்து தெளிவான படத்தை பதிவேற்றவும்.",
  }
};
