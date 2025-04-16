document.addEventListener('DOMContentLoaded', function() {
    // Get affiliate info from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const affiliateParam = urlParams.get('ref');

    if (affiliateParam) {
        // Decode and split the affiliate parameter
        const decodedParam = decodeURIComponent(affiliateParam);
        const affiliateName = decodedParam.split('_').join(' ');

        // Show affiliate section and update name
        const affiliateSection = document.querySelector('.affiliate-section');
        const affiliateNameSpan = document.getElementById('affiliateName');

        if (affiliateSection && affiliateNameSpan) {
            affiliateSection.style.display = 'block';
            affiliateNameSpan.textContent = affiliateName;
        }
    }

    // Add to existing form data when storing/submitting
    const storeFormData = (formData) => {
        formData.affiliate = affiliateParam || '';
        return formData;
    };

    // Valid Nigerian states
    const validStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
        "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
        "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
        "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
        "Yobe", "Zamfara"
    ];

    // LGA data for Nigerian states
    const lgaData = {
        "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
        "Adamawa": ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
        "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
        "Anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
        "Bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
        "Bayelsa": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
        "Benue": ["Agatu", "Apa", "Ado", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Oturkpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
        "Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
        "Cross River": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
        "Delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
        "Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
        "Edo": ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Orhionmwon", "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
        "Ekiti": ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
        "Enugu": ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"],
        "FCT": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"],
        "Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
        "Imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
        "Jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Kaugama", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
        "Kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
        "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
        "Katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
        "Kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
        "Kogi": ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
        "Kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
        "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
        "Nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
        "Niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
        "Ogun": ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"],
        "Ondo": ["Akoko North-East", "Akoko North-West", "Akoko South-West", "Akoko South-East", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
        "Osun": ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Ife Central", "Ife East", "Ife North", "Ife South", "Egbedore", "Ejigbo", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
        "Oyo": ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo", "Oyo East", "Saki East", "Saki West", "Surulere"],
        "Plateau": ["Bokkos", "Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang South", "Langtang North", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
        "Rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
        "Sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
        "Taraba": ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
        "Yobe": ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
        "Zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe", "Zurmi"]
    };

    // Get package details from URL parameters
    const packageParam = urlParams.get('package');
    const amount = urlParams.get('amount');

    // Update package details in the UI and hidden fields
    document.getElementById('packageName').textContent = packageParam || 'Foundation Package';
    document.getElementById('packagePrice').textContent = amount ? `₦${Number(amount).toLocaleString()}` : '₦5,000';
    document.getElementById('packageInput').value = packageParam || 'Foundation Package';
    document.getElementById('amountInput').value = amount || '5000';

    // Set affiliate value if present
    if (affiliateParam) {
        document.getElementById('affiliateInput').value = affiliateParam;
    }

    const paymentForm = document.getElementById('paymentForm');
    const paymentButton = document.getElementById('paymentButton');
    const tokenButton = document.getElementById('tokenButton');
    const stateInput = document.getElementById('state');
    const lgaInput = document.getElementById('lga');

    // Populate state dropdown
    validStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateInput.appendChild(option);
    });

    // State dropdown change event
    stateInput.addEventListener('change', function() {
        // Clear existing LGA options
        lgaInput.innerHTML = '<option value="" disabled selected>Select your LGA</option>';

        const selectedState = this.value;

        if (selectedState && lgaData[selectedState]) {
            // Enable LGA dropdown
            lgaInput.disabled = false;

            // Populate LGA dropdown based on selected state
            lgaData[selectedState].forEach(lga => {
                const option = document.createElement('option');
                option.value = lga;
                option.textContent = lga;
                lgaInput.appendChild(option);
            });
        } else {
            // Disable LGA dropdown if no state is selected
            lgaInput.disabled = true;
        }

        validateForm();
    });

    // LGA dropdown change event
    lgaInput.addEventListener('change', function() {
        validateForm();
    });

    // Function to validate form
    function validateForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const state = document.getElementById('state').value;
        const lga = document.getElementById('lga').value;
        const phone = document.getElementById('phone').value.trim();

        // Validate name (minimum 3 characters)
        const isValidName = fullName.length >= 3;

        // Validate email (must be valid email format)
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Validate state (must be in valid states list)
        const isValidState = validStates.includes(state);

        // Validate LGA (must be at least 3 characters)
        const isValidLGA = lga.length >= 3;

        // Validate phone (must be valid phone format)
        const isValidPhone = /^\+?[\d\s-]{10,}$/.test(phone);

        const isValid = isValidName && isValidEmail && isValidState && isValidLGA && isValidPhone;

        // Update button states with animation
        const paymentButton = document.getElementById('paymentButton');
        const tokenButton = document.getElementById('tokenButton');

        if (isValid) {
            if (!paymentButton.classList.contains('active')) {
                // Add active class with animation
                paymentButton.classList.add('active');
                tokenButton.classList.add('active');

                // Add a subtle pop animation when buttons become active
                paymentButton.animate([
                    { transform: 'scale(1)', opacity: 0.8 },
                    { transform: 'scale(1.05)', opacity: 1 },
                    { transform: 'scale(1)', opacity: 1 }
                ], {
                    duration: 400,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });

                tokenButton.animate([
                    { transform: 'scale(1)', opacity: 0.8 },
                    { transform: 'scale(1.05)', opacity: 1 },
                    { transform: 'scale(1)', opacity: 1 }
                ], {
                    duration: 400,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    delay: 100
                });
            }
        } else {
            paymentButton.classList.remove('active');
            tokenButton.classList.remove('active');
        }

        return isValid;
    }

    // Add event listeners to all form fields
    const formFields = ['fullName', 'email', 'state', 'lga', 'phone'];
    formFields.forEach(fieldId => {
        document.getElementById(fieldId).addEventListener('input', validateForm);
    });

    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill in all required fields correctly');
            return;
        }

        // Store form data before submission
        const formData = {
            package: document.getElementById('packageInput').value,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            state: document.getElementById('state').value,
            lga: document.getElementById('lga').value,
            phone: document.getElementById('phone').value,
            amount: document.getElementById('amountInput').value,
            affiliate: document.getElementById('affiliateInput').value
        };

        const storedFormData = storeFormData(formData);
        sessionStorage.setItem('paymentFormData', JSON.stringify(storedFormData));

        // Show loading state on button
        const paymentButton = document.getElementById('paymentButton');
        const originalButtonText = paymentButton.innerHTML;
        paymentButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        paymentButton.disabled = true;

        // Initialize Paystack payment
        const handler = PaystackPop.setup({
            key: 'pk_test_3a9712dd9856f38b6b0875f553cba64a866422f6', // Replace with your Paystack public key
            email: document.getElementById('email').value,
            amount: parseFloat(document.getElementById('amountInput').value) * 100, // Convert to kobo
            currency: 'NGN',
            ref: 'ENS'+Math.floor((Math.random() * 1000000000) + 1),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Full Name",
                        variable_name: "full_name",
                        value: document.getElementById('fullName').value
                    },
                    {
                        display_name: "State",
                        variable_name: "state",
                        value: document.getElementById('state').value
                    },
                    {
                        display_name: "LGA",
                        variable_name: "lga",
                        value: document.getElementById('lga').value
                    },
                    {
                        display_name: "Phone",
                        variable_name: "phone",
                        value: document.getElementById('phone').value
                    },
                    {
                        display_name: "Package",
                        variable_name: "package",
                        value: document.getElementById('packageInput').value
                    },
                    {
                        display_name: "Affiliate",
                        variable_name: "affiliate",
                        value: document.getElementById('affiliateInput').value || 'None'
                    }
                ]
            },
            callback: function(response) {
                // Redirect to success page with reference
                window.location.href = `success.html?reference=${response.reference}`;
            },
            onClose: function() {
                // Reset button state
                paymentButton.innerHTML = originalButtonText;
                paymentButton.disabled = false;
                alert('Payment window closed. Please try again if you wish to complete your payment.');
            }
        });

        // Open Paystack payment modal
        handler.openIframe();
    });

    // Add token button handler
    tokenButton.addEventListener('click', function() {
        showTokenModal();
    });

    function validateChannelLinks(channel1Link, channel2Link) {
        // Clean and normalize the links to handle variations
        function normalizeUrl(url) {
            return url.trim()
                .toLowerCase()
                .replace('https://', '')
                .replace('www.', '')
                .replace(/\/$/, '')
                .replace('youtube.com/', '')
                .replace('@', '');
        }

        const ensaasmoExpected = "ensaasmo";
        const yigiExpected = "yigi_impact";

        const channel1Normalized = normalizeUrl(channel1Link);
        const channel2Normalized = normalizeUrl(channel2Link);

        const isEnsaasmoValid = channel1Normalized.includes(ensaasmoExpected);
        const isYigiValid = channel2Normalized.includes(yigiExpected);

        return isEnsaasmoValid && isYigiValid;
    }

    function showTokenModal() {
        const tokenForm = document.createElement('div');
        tokenForm.className = 'token-form';
        tokenForm.innerHTML = `
            <div class="token-overlay"></div>
            <div class="token-modal">
                <button class="close-modal">×</button>
                <div class="token-wrapper">
                    <div class="token-header">
                        <i class="fas fa-id-card"></i>
                        <h3>Access with PVC</h3>
                        <p>Follow these steps to verify your voter eligibility</p>
                    </div>
                    <div class="youtube-steps">
                        <p class="step-label">1. Subscribe to these YouTube channels:</p>
                        <div class="channel-links">
                            <a href="https://youtube.com/@ensaasmo?si=hbQtrErjC_o-5Sq4" target="_blank" class="channel-link" id="ensaasmoButton">
                                <i class="fab fa-youtube"></i>
                                ENSAASMO
                            </a>
                            <a href="https://youtube.com/@yigi_impact?si=24Z2MPK3kJy0rzux" target="_blank" class="channel-link" id="yigiButton">
                                <i class="fab fa-youtube"></i>
                                YIGI
                            </a>
                        </div>
                        <p class="step-label">2. Copy and paste the links below to verify:</p>
                        <div class="channel-inputs">
                            <div class="input-group">
                                <label>ENSAASMO Channel Link:</label>
                                <input type="text" class="channel-input" id="channel1Input" placeholder="Paste ENSAASMO channel link here">
                            </div>
                            <div class="input-group" style="margin-top: 1.5rem;">
                                <label>YIGI Channel Link:</label>
                                <input type="text" class="channel-input" id="channel2Input" placeholder="Paste YIGI channel link here">
                            </div>
                        </div>
                        <button type="button" class="verify-channels-btn">
                            <i class="fas fa-check"></i> Verify Subscriptions
                        </button>
                    </div>
                    <div class="token-input-group" style="opacity: 0.5; pointer-events: none;">
                        <label for="pvcInput">PVC ID Number</label>
                        <input type="text" id="pvcInput" placeholder="Enter your PVC ID number" class="token-input" maxlength="19">
                        <div class="input-hint">Format: 1234-5678-9012-3456</div>
                    </div>
                    <div class="token-notice">
                        <i class="fas fa-shield-alt"></i>
                        <p>Please ensure you enter a valid PVC ID number and subscribe to both channels. This helps us verify your eligibility.</p>
                    </div>
                    <button type="button" class="verify-token-btn" style="opacity: 0.5; pointer-events: none;">
                        <i class="fas fa-check-circle"></i> Access Assessment
                    </button>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .token-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                z-index: 1000;
            }

            .token-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 1.5rem;
                box-shadow: 0 25px 50px rgba(0, 32, 96, 0.25);
                z-index: 1001;
                width: 95%;
                max-width: 800px;
                max-height: 95vh;
                overflow: hidden;
            }

            .token-wrapper {
                padding: 3rem;
                max-height: 95vh;
                overflow-y: auto;
                padding-bottom: 9rem;
                scrollbar-width: thin;
                scrollbar-color: var(--accent) #f1f5f9;
            }

            .token-wrapper::-webkit-scrollbar {
                width: 8px;
            }

            .token-wrapper::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 4px;
            }

            .token-wrapper::-webkit-scrollbar-thumb {
                background: var(--accent);
                border-radius: 4px;
            }

            .token-wrapper::-webkit-scrollbar-thumb:hover {
                background: var(--neon);
            }

            .close-modal {
                position: absolute;
                top: 1.5rem;
                right: 1.5rem;
                background: #f1f5f9;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                font-size: 1.5rem;
                color: #64748b;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1002;
            }

            .close-modal:hover {
                background: #e2e8f0;
                color: #0f172a;
                transform: rotate(90deg);
            }

            .token-header {
                text-align: center;
                margin-bottom: 3rem;
                padding: 1.5rem;
                border-bottom: 1px solid rgba(14, 165, 233, 0.1);
                background: linear-gradient(to bottom, rgba(14, 165, 233, 0.05), transparent);
            }

            .token-header i {
                font-size: 3.5rem;
                color: var(--accent);
                margin-bottom: 1.5rem;
                display: block;
                animation: cardFlip 1.5s ease infinite alternate;
            }

            .token-header h3 {
                font-size: 2.5rem;
                margin: 1rem 0;
                background: linear-gradient(135deg, var(--accent), var(--neon));
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .token-header p {
                color: #64748b;
                font-size: 1.1rem;
            }

            .youtube-steps {
                background: rgba(14, 165, 233, 0.03);
                border-radius: 1.5rem;
                padding: 2.5rem;
                margin-bottom: 3rem;
                border: 1px solid rgba(14, 165, 233, 0.1);
            }

            .step-label {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 1.5rem;
                font-size: 1.1rem;
            }

            .channel-links {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
                margin-bottom: 3rem;
            }

            .channel-link {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.25rem 1.5rem;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 1rem;
                color: #ff0000;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }

            .channel-link:hover {
                background: #fff5f5;
                border-color: #ff0000;
                transform: translateY(-3px);
                box-shadow: 0 8px 15px rgba(255, 0, 0, 0.1);
            }

            .channel-link i {
                font-size: 1.5rem;
            }

            .channel-inputs {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
                margin: 1.5rem 0;
            }

            .input-group {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .input-group label {
                font-weight: 500;
                color: #1e293b;
                font-size: 0.95rem;
            }

            .channel-input {
                width: 100%;
                padding: 1rem 1.25rem;
                border: 1px solid #e2e8f0;
                border-radius: 0.75rem;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                background: white;
            }

            .channel-input:focus {
                border-color: var(--accent);
                outline: none;
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
            }

            .token-input-group {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 1.5rem;
                padding: 2.5rem;
                margin: 2.5rem 0;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }

            .token-input-group label {
                display: block;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }

            .token-input {
                width: 100%;
                padding: 1.25rem;
                border: 2px solid #e2e8f0;
                border-radius: 1rem;
                font-size: 1.2rem;
                font-family: monospace;
                letter-spacing: 2px;
                margin-bottom: 0.75rem;
                transition: all 0.3s ease;
                background: #f8fafc;
            }

            .token-input:focus {
                border-color: var(--accent);
                outline: none;
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
                background: white;
            }

            .input-hint {
                font-size: 0.9rem;
                color: #64748b;
                text-align: right;
            }

            .token-notice {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1.5rem;
                background: rgba(14, 165, 233, 0.05);
                border: 1px solid rgba(14, 165, 233, 0.1);
                border-radius: 1rem;
                margin: 2rem 0;
            }

            .token-notice i {
                color: var(--accent);
                font-size: 1.2rem;
                margin-top: 0.2rem;
            }

            .token-notice p {
                font-size: 0.95rem;
                line-height: 1.5;
                color: #475569;
                margin: 0;
            }

            .verify-token-btn {
                width: 100%;
                max-width: 400px;
                margin: 3rem auto 4rem;
                display: block;
                padding: 1.25rem;
                background: linear-gradient(135deg, var(--accent), var(--neon));
                color: white;
                border: none;
                border-radius: 1rem;
                font-weight: 600;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
                position: relative;
                bottom: 0;
            }

            .verify-token-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 30px rgba(14, 165, 233, 0.3);
            }

            .verify-token-btn i {
                font-size: 1.3rem;
            }

            @keyframes cardFlip {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(180deg); }
            }

            @media (max-width: 640px) {
                .token-modal {
                    width: 95%;
                }

                .token-wrapper {
                    padding: 2rem 1.5rem;
                }

                .token-header h3 {
                    font-size: 1.8rem;
                }

                .channel-links,
                .channel-inputs {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .token-input-group {
                    padding: 1.5rem;
                }
            }
        `;

        document.head.appendChild(style);

        document.body.appendChild(tokenForm);

        const pvcInput = document.getElementById('pvcInput');
        pvcInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join('-');
            }
            e.target.value = value;

            // Enable and highlight access button when PVC is fully entered
            const accessBtn = tokenForm.querySelector('.verify-token-btn');
            if (value.length === 19) { // Full PVC number entered
                accessBtn.style.opacity = '1';
                accessBtn.style.pointerEvents = 'auto';
                accessBtn.style.animation = 'highlight-button 1s ease';
                accessBtn.style.transform = 'scale(1.05)';
                accessBtn.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.3)';
            } else {
                accessBtn.style.opacity = '0.5';
                accessBtn.style.pointerEvents = 'none';
                accessBtn.style.animation = 'none';
                accessBtn.style.transform = 'none';
                accessBtn.style.boxShadow = 'none';
            }
        });

        let ensaasmoClicked = false;
        let yigiClicked = false;

        const ensaasmoButton = tokenForm.querySelector('#ensaasmoButton');
        const yigiButton = tokenForm.querySelector('#yigiButton');

        ensaasmoButton.addEventListener('click', () => {
            ensaasmoClicked = true;
            ensaasmoButton.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            ensaasmoButton.style.borderColor = '#ff0000';
        });

        yigiButton.addEventListener('click', () => {
            yigiClicked = true;
            yigiButton.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            yigiButton.style.borderColor = '#ff0000';
        });

        tokenForm.querySelector('.verify-channels-btn').addEventListener('click', function() {
            const channel1Link = document.getElementById('channel1Input').value.trim();
            const channel2Link = document.getElementById('channel2Input').value.trim();

            if (!channel1Link || !channel2Link) {
                alert('Please paste both YouTube channel subscription links');
                return;
            }

            if (!ensaasmoClicked || !yigiClicked) {
                alert('Please visit both YouTube channels by clicking the buttons above');
                return;
            }

            // Verify the links are correct
            if (!validateChannelLinks(channel1Link, channel2Link)) {
                alert('Please make sure you have copied the correct YouTube channel links');
                return;
            }

            // Verification success - update UI
            this.innerHTML = '<i class="fas fa-check"></i> Verified!';
            this.style.backgroundColor = '#10b981';
            this.disabled = true;

            // Enable PVC input section
            const pvcSection = tokenForm.querySelector('.token-input-group');
            pvcSection.style.opacity = '1';
            pvcSection.style.pointerEvents = 'auto';
            pvcSection.style.animation = 'highlight-section 1s ease';
            pvcSection.style.border = '2px solid var(--accent)';
            pvcSection.style.boxShadow = '0 0 15px rgba(14, 165, 233, 0.2)';
        });

        const newStyles = `
            @keyframes highlight-section {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }

            @keyframes highlight-button {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1.05); }
            }

            .verify-channels-btn {
                width: 100%;
                padding: 1rem;
                margin: 1.5rem 0;
                background: var(--accent);
                color: white;
                border: none;
                border-radius: 0.75rem;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
            }

            .verify-channels-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(14, 165, 233, 0.2);
            }

            .channel-inputs {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
                margin: 1.5rem 0;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = newStyles;
        document.head.appendChild(styleSheet);

        const verifyBtn = tokenForm.querySelector('.verify-token-btn');
        verifyBtn.addEventListener('click', function() {
            const channel1Link = document.getElementById('channel1Input').value.trim();
            const channel2Link = document.getElementById('channel2Input').value.trim();
            const pvcNumber = document.getElementById('pvcInput').value.trim();

            if (!channel1Link || !channel2Link) {
                alert('Please paste both YouTube channel subscription links');
                return;
            }

            if (!pvcNumber || pvcNumber.length < 19) {
                alert('Please enter a valid PVC ID number');
                return;
            }

            window.location.href = `success.html?reference=PVC-${pvcNumber}`;
        });

        const closeBtn = tokenForm.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            tokenForm.remove();
        });

        const overlay = tokenForm.querySelector('.token-overlay');
        overlay.addEventListener('click', function() {
            tokenForm.remove();
        });
    }
});