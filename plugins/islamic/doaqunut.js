exports.run = {
usage: ['doaqunut'],
hidden: ['qunut'],
use: 'pendek / panjang',
category: 'islamic',
async: async (m, { func, mecha }) => {
if (m.args[0] && m.args[0].toLowerCase() === 'pendek') {
let pendek = `Dikutip dalam Kitab Al-Adzkar karya Imam an-Nawawi, berikut ini bacaan doa qunut versi pendek:

اللَّهُمَّ اهْدِنِي فِيْمَنْ هَدَيْتَ، وَعَافِنِي فِيْمَنْ عَافَيْتَ، وَتَوَلَّنِيْ فِيْمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيْمَا أَعْطَيْتَ، وَقِنِي شَرَّمَا قَضَيْتَ، فَإِنَّكَ تَقْضِيَ وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ .

Latin: Allaahummah dinii fii man hadaits, wa 'aafiinii fii man 'aafaits, wa tawallanii fii man tawallaits, wa baarik lii fii maa a'thaits, wa qi nii syarra maa qadlaits, fa innaka taqdli wa laa yuqdlaa 'alaik, wa innahuu laa yadzillu mau waalaits, tabaarakta rabbanaa wa ta'aalits.

Artinya: "Ya Allah, berilah aku petunjuk di antara orang-orang yang Engkau beri petunjuk, berilah kesejahteraan kepadaku di antara orang-orang yang Engkau beri kesejahteraan, tolonglah aku di antara orang-orang yang kau beri pertolongan, berikanlah keberkahan kepadaku pada apa-apa yang Engkau berikan kepadaku, dan peliharalah aku dari keburukan yang Engkau putuskan, karena sesungguhnya Engkau memutuskan dan tidak diputuskan atas-Mu, dan tiada kehinaan kepada orang yang telah Engkau tolong, Maha Suci Engkau wahai Tuhan kami, lagi Maha Tinggi."`
mecha.reply(m.chat, pendek, m)
} else if (m.args[0] && m.args[0].toLowerCase() === 'panjang') {
let panjang = `Sementara doa qunut subuh versi panjang, dilansir dari buku Panduan Muslim Sehari-hari karya KH. M. Hamdan Rasyid & Saiful Hadi El-Sutha, yaitu sebagai berikut:

اللَّهُمَّ اهْدِنِي فِيْمَنْ هَدَيْتَ، وَعَافِنِي فِيْمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيْمَنُ تَوَلَّيْتَ، وَبَارِكْ لِي فِيْمَا أَعْطَيْتَ، وَقِنِي بِرَحْمَتِكَ شَرَّمَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمّي وَعَلَى آلِهِ وَصَحْبِهِ وَ سَلَّم

Latin: Allaahummahdinii fiiman hadaita, wa 'aafinii fiman 'aafaita, wa tawallanii fii man tawallaita, wa baarik lii fiimaa a'thaita, wa qinii bi rahmatika syarra maa qadhaita fa innaka taqdhii wa laa yuqdhaa 'alaika, wa innahu laa yadzillu man waalaita, wa laa ya'izzu man 'adaita, tabaarakta rabbanaa wa ta'aalaita, fa lakal hamdu 'alaa maa qadhaita, astahgfiruka wa atuubu ilaika, wa shallallaahu 'alaa sayyidinaa Muhammadin-nabiyyil ummiyyi wa 'alaa alihi wa shahbihi wasallama.

Artinya: "Ya Allah, berikanlah aku petunjuk seperti orang-orang telah Engkau beri petunjuk. Berilah aku kesehatan, seperti orang-orang yang telah Engkau beri kesehatan. Pimpinlah aku bersama orang-orang yang telah Engkau pimpin. Limpahkanlah keberkahan kepada apa saja yang telah Engkau berikan kepadaku. Peliharalah aku dengan kasih sayang-Mu dari segala keburukan apa-apa yang telah Engkau putuskan (tetapkan), karena sesungguhnya Engkau-lah yang memberikan ketentuan dan tidak ada yang bisa memberikan ketentuan (keputusan) atas diri-Mu. Sesungguhnya tidaklah akan hina orang-orang yang telah Engkau berikan kekuasaan, dan tidaklah akan mulia orang yang telah Engkau musuhi, Maha Berkah lah Engkau dan Maha Luhur lah Engkau. Segala puji bagi-Mu atas apa yang telah Engkau tetapkan. Aku mohon ampun dan bertobat kepada-Mu. Dan semoga Allah memberikan rahmat dan keselamatan (sholawat) atas diri junjungan kami. Nabi Muhammad, dan juga atas keluarga dan para sahabatnya."`
mecha.reply(m.chat, panjang, m)
} else {
let txt = `Membaca doa qunut saat melaksanakan sholat Subuh adalah perbuatan yang dianggap sunnah menurut pandangan mazhab Syafi'i dan Maliki. Pandangan ini tercermin dalam Kitab Al-Fiqh 'ala al-madzahib al-khamsah yang dikarang oleh Muhammad Jawad Mughniyah.
Sementara itu, Imam Nawawi dalam Kitab Al-Adzkar memberikan penilaian bahwa membaca doa qunut dalam sholat Subuh adalah sunnah yang dianjurkan secara kuat (sunnah muakkad). Pandangan ini didukung oleh hadits-hadits yang menjadi dasar kesunahan membaca doa qunut dalam sholat Subuh. Salah satu hadits yang menjadi rujukan adalah sebagai berikut:

عَنْ أَنَسِ بْنِ مَالِكٍ قَالَ مَا زَالَ رَسُولُ اللهِ يَقْنُتُ فِي الْفَجْرِ حَتَّى فَارَقَ الدُّنْيَا

Artinya: "Diriwayatkan dari Anas Ibn Malik, ia berkata, "Rasulullah SAW senantiasa membaca qunut ketika salat subuh sehingga beliau wafat.'" (HR Ahmad)

Adapun bacaan doa qunut yang dapat diamalkan oleh umat Islam dalam sholat Subuh, di antaranya adalah sebagai berikut:

Bacaan Doa Qunut Subuh

1. Doa Qunut Subuh Versi Pendek

Dikutip dalam Kitab Al-Adzkar karya Imam an-Nawawi, berikut ini bacaan doa qunut versi pendek:

اللَّهُمَّ اهْدِنِي فِيْمَنْ هَدَيْتَ، وَعَافِنِي فِيْمَنْ عَافَيْتَ، وَتَوَلَّنِيْ فِيْمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيْمَا أَعْطَيْتَ، وَقِنِي شَرَّمَا قَضَيْتَ، فَإِنَّكَ تَقْضِيَ وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ .

Latin: Allaahummah dinii fii man hadaits, wa 'aafiinii fii man 'aafaits, wa tawallanii fii man tawallaits, wa baarik lii fii maa a'thaits, wa qi nii syarra maa qadlaits, fa innaka taqdli wa laa yuqdlaa 'alaik, wa innahuu laa yadzillu mau waalaits, tabaarakta rabbanaa wa ta'aalits.

Artinya: "Ya Allah, berilah aku petunjuk di antara orang-orang yang Engkau beri petunjuk, berilah kesejahteraan kepadaku di antara orang-orang yang Engkau beri kesejahteraan, tolonglah aku di antara orang-orang yang kau beri pertolongan, berikanlah keberkahan kepadaku pada apa-apa yang Engkau berikan kepadaku, dan peliharalah aku dari keburukan yang Engkau putuskan, karena sesungguhnya Engkau memutuskan dan tidak diputuskan atas-Mu, dan tiada kehinaan kepada orang yang telah Engkau tolong, Maha Suci Engkau wahai Tuhan kami, lagi Maha Tinggi."

2. Doa Qunut Subuh Versi Panjang

Sementara doa qunut subuh versi panjang, dilansir dari buku Panduan Muslim Sehari-hari karya KH. M. Hamdan Rasyid & Saiful Hadi El-Sutha, yaitu sebagai berikut:

اللَّهُمَّ اهْدِنِي فِيْمَنْ هَدَيْتَ، وَعَافِنِي فِيْمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيْمَنُ تَوَلَّيْتَ، وَبَارِكْ لِي فِيْمَا أَعْطَيْتَ، وَقِنِي بِرَحْمَتِكَ شَرَّمَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمّي وَعَلَى آلِهِ وَصَحْبِهِ وَ سَلَّم

Latin: Allaahummahdinii fiiman hadaita, wa 'aafinii fiman 'aafaita, wa tawallanii fii man tawallaita, wa baarik lii fiimaa a'thaita, wa qinii bi rahmatika syarra maa qadhaita fa innaka taqdhii wa laa yuqdhaa 'alaika, wa innahu laa yadzillu man waalaita, wa laa ya'izzu man 'adaita, tabaarakta rabbanaa wa ta'aalaita, fa lakal hamdu 'alaa maa qadhaita, astahgfiruka wa atuubu ilaika, wa shallallaahu 'alaa sayyidinaa Muhammadin-nabiyyil ummiyyi wa 'alaa alihi wa shahbihi wasallama.

Artinya: "Ya Allah, berikanlah aku petunjuk seperti orang-orang telah Engkau beri petunjuk. Berilah aku kesehatan, seperti orang-orang yang telah Engkau beri kesehatan. Pimpinlah aku bersama orang-orang yang telah Engkau pimpin. Limpahkanlah keberkahan kepada apa saja yang telah Engkau berikan kepadaku. Peliharalah aku dengan kasih sayang-Mu dari segala keburukan apa-apa yang telah Engkau putuskan (tetapkan), karena sesungguhnya Engkau-lah yang memberikan ketentuan dan tidak ada yang bisa memberikan ketentuan (keputusan) atas diri-Mu. Sesungguhnya tidaklah akan hina orang-orang yang telah Engkau berikan kekuasaan, dan tidaklah akan mulia orang yang telah Engkau musuhi, Maha Berkah lah Engkau dan Maha Luhur lah Engkau. Segala puji bagi-Mu atas apa yang telah Engkau tetapkan. Aku mohon ampun dan bertobat kepada-Mu. Dan semoga Allah memberikan rahmat dan keselamatan (sholawat) atas diri junjungan kami. Nabi Muhammad, dan juga atas keluarga dan para sahabatnya."

Manfaat Membaca Doa Qunut Subuh

Banyak keutamaan dan manfaat berharga terkait dengan membaca Doa Qunut Subuh selama melaksanakan sholat Subuh. Berikut beberapa di antaranya:

1. Memohon Rahmat dan Petunjuk

Doa Qunut adalah doa yang mencari pengampunan, petunjuk, dan rahmat dari Allah. Dengan membacanya, umat Islam menunjukkan kesadaran akan ketergantungan kepada-Nya dan memohon pertolongan serta bimbingan dalam setiap aspek kehidupan sehari-hari.

2. Memperkuat hubungan dengan Allah

Membaca Doa Qunut Subuh dalam sholat Subuh adalah cara yang efektif untuk memperdalam ikatan antara seorang Muslim dengan Allah. Hal ini menjadi sebuah amal ibadah yang menggambarkan keyakinan dan kesetiaan individu kepada Allah.

3. Perlindungan dari kejahatan

Doa Qunut adalah salah satu doa perlindungan dari ancaman dan bahaya. Dengan mengucapkannya, umat Islam berharap kepada Allah untuk melindungi mereka dari segala bentuk ancaman dan kejahatan, yang dapat berasal dari sumber yang terlihat maupun yang tersembunyi.

4. Memperkuat iman dan kepercayaan kepada Allah

Dengan mengamalkan Doa Qunut, umat Islam mengokohkan iman dan keyakinan mereka pada kuasa dan kasih sayang Allah. Ini merupakan pijakan penting dalam menjaga sikap positif mereka ketika menghadapi cobaan dan kesulitan. Mereka mengetahui bahwa Allah senantiasa siap memberi pertolongan dan dukungan dalam setiap situasi.

5. Mengikuti Sunnah

Membaca Doa Qunut saat sholat Subuh adalah tindakan yang mengikuti jejak Nabi Muhammad SAW, yang seringkali membacanya sendiri. Dengan mengikuti Sunnah ini, umat Islam berpeluang mendapatkan pahala dan berkah yang berlimpah dari Allah.

Secara keseluruhan, keutamaan Doa Qunut terletak pada daya tariknya untuk mempererat ikatan antara umat Islam dan Allah. Doa ini adalah wujud permohonan akan ampunan dan petunjuk, serta permohonan perlindungan dari ancaman dan kejahatan. Sebagai bentuk ibadah yang kuat, Doa Qunut memiliki potensi besar untuk membawa manfaat yang luar biasa bagi umat islam.`
mecha.reply(m.chat, txt, m)
}
}
}