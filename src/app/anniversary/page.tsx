'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { motion } from 'framer-motion';

export default function AnniversaryPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handlePlayAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.error('Error playing audio:', error);
                        alert('Tidak bisa memutar audio. Pastikan file audio ada dan format didukung.');
                    });
            }
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 overflow-y-auto">
            {/* Custom Background for Anniversary Page */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-b from-pink-100 via-purple-50 to-rose-50" />
            
            <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
                <div className="w-full max-w-3xl">
                    <Header title="Anniversary Message" subtitle="Ucapan sapisial untukmu 💕" />
                    
                    <Card className="p-4 sm:p-6 md:p-8">
                        {/* Title */}
                        <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-6 sm:mb-8"
                        >
                        <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-3">
                            Happy Anniversary, Sayangkuuuuu! 🎉
                        </h2>
                        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                        </motion.div>

            {/* Message Content */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="prose prose-slate max-w-none mb-6 sm:mb-8"
            >
            <div className="space-y-3 sm:space-y-4 text-slate-700 leading-relaxed text-justify">
                <p className="text-base sm:text-lg">
                Haloo sayang, ga kerasa yahh kitaa udah lebih dari 1095 harii bareng barengg hihihi, ga kerasa udahh 3 tahun video terromantiss, ga kerasa udah 3 tahun mobil akuu nabrak gapura 😌, ga kerasa udah 3 tahun bunga mawar pertama kamuu 🌹, ga kerasa udah 3 tahun aku digantung sebelum masuk pintu tol padalarang ☺️.
                </p>
                
                <p className="text-base sm:text-lg">
                Makasii banyakk yaa sayangg selama 3 tahun ini udahh terus bertahan sama akuu udah sayang sama akuu, udah sabar sama akuu, udahhh care sama akuu, udahh semangatin akuu, udahh ngertiin aku, udahh baikin akuu, udahh ngangenin akuu, udahh muji akuu, udahh jajanin akuw, udahh nganterin akuu, udahh nemenin akuu, udahh wah udahh semuanyaa keknya (kecuali nikah) hihi. makasiii yaaa sayangg udahh banyak bangett yang kamuu lakuin buat akuu, kamuuu udahh melakukan semuanya buatt akuu, udahhh semuanyaa dehh dann semuanyaa pastii membuat akuu bahagiaa, udahhhlah ah pokoknyaa kamuuu udshh jadii yang terbaik buatt akuu. makasiii udahhh jadii tempatt kembalii aku dan makasii jugaa kamuu udahh sering cerita samaa akuu kek akuu bner bnrr jadi tempatt kamuu curhat semua hall. makasiiiiiii banyakkk yaa sayanggkuuu cintakuuu pacakuu hihi
                </p>

                <p className="text-base sm:text-lg">
                Banyakk bangett kenangann kita selama 1095 harii iniii, dari yang dicie cieinnn sama satu sekolahann, truss moo nganterin kamuu ke rumah dari sekolah aja sesulit itu dan segamau ituu pas ituu tapii sekarangg udahh seringg bangett aku ke rumah kamuu hihi, dari yang awalnya dijodoh jodohinn truss bisaa sampee sekarangg sihh emangg udahh takdir yang mempertemukan kita sengg hahahaha, darii yang dlu malu malu sekarang jadi gatau maluu (aku doang sih hihi), darii yang dlu fotoo sambil tutup mukaa sekarang fotoo di mana aja dan kapan ajaa hahah sambil beol pun, tapiii trenn kitaa udah ga jalann lagii nih sayang bangett huhu. dahh dehh pokoknyaa banyakk bangett bangettttt kenangann kitaa yangg bner bnerr aku inget dann selaluu jadiii core memory akuu, yaa pokoknyaa semuaa hal yang ada hubungannya sama kamuu itu dah pastii masuk core memoryy akuuww hihi dan pastii bakal akuu inget teruss bahkan sekecil apapun ituu (ya ada yang lupa tipiss lahh hehe).
                </p>

                <p className="text-base sm:text-lg">
                darii beberapa taunn yang laluu harusnya semoga semogaa kitaa udshh ada beberapa yang terwujudkann sengg, nah sekarang nambahh teruss harapan yang bakal ada terus tiap taunnya ampe akhir. semogaaa hubungan kitaa bakal teruss langgengg sampee akhirr hayatt yaa sayangg, semogaa kitaa cpett nikahh, semogaaa kitaa berduaa lancarr kuliahnyaa biarr luluss cpett dapet kerjaa cpett dapet duit cpett dan akhirnyaa nikahh dehh hihihi, semogaaa wishlist kita bner bner kechecklist yaaa seng satu persatuu, semogaa kamuu teruss sabarr samaa akuu dan mogaa akuu juga ga bkin kamuu ksell teruss hihihi, semogaaa yang terbaikk buatt kitaa berduaa yaa sayangkuwww.
                </p>

                <p className="text-base sm:text-lg">
                Untuk tahun tahun berikutnyaa akuu bakal teruss jadi nazwan yang sama dari tahun pertama kita yangg bner bner sayang, peduli, bangga, dann bnerbner mengagumii kamuu bangettt. Kamu udahh jadi orang yang bner bner nemenin aku banget dari awal ampe sekarang kapanpunn ituu yang bner bner buat akuu bersyukurr bangett punya kamuu disamping akuu yang selalu ada buatt akuu, makasii yaa sayangg udahh selaluu ada buat akuu. Kamuu selaluu menjadii yang terspecial dan punyaa tempat palinh special di hati akuu bahkan hati akuu ga cukup menampung kamuu inii hahaha. Akuu janji bakal teruss menjadi pribadi yangg sayang sama kamuu dan selaluu berusaha buat jadi versi terbaik untukk kamuu, tapi kamuu juga jangan bosen bosen ngingetin akuu yaa kalau aku ada salahh jadi aku bisa berubah menjadi lebih baikk lagii dan bisa sebaik kamuuu 🫰🏻. Semogaa kitaa cpettt satu rumahh biar bisa ngucapinn langsungggg huhhh.
                </p>

                <p className='text-base sm:text-lg'>
                Sekali lagiii happyyy anniversaryyy sayanggggggkuu cintakuu pacaakuu bocilkuu pacarkuu cewekuuu cantikkuu sahabatkuu rumahkuu calon istrikuu kebanggaankuu modelkuu partnerkuu and my cutiee little queennnn ❤️❤️❤️❤️❤️ 
                </p>

                <p className="text-base sm:text-lg font-semibold text-pink-600">
                I loveee youuu sayanggg  😘😘🥰
                Akuu bner bner sangatt sayanggg bangett samaa kamuuu 🥰😘🥰
                WOOPPYUUU BOCILLL 🫰🏻🫰🏻🫰🏻🫰🏻
                </p>

                <div className="text-right text-slate-600 italic mt-6">
                —  Nazwan 💖
                </div>
            </div>
            </motion.div>            {/* Divider */}
            <div className="my-6 sm:my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
            <span className="text-xl sm:text-2xl">🎵</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>

            {/* Audio Player Section */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
            >
            <p className="text-sm sm:text-base text-slate-600 mb-4">
                Dengerin lagi ucapan aku dari motor hihi🎧
            </p>
            
            <button
                onClick={handlePlayAudio}
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
                <span className="text-xl sm:text-2xl">
                {isPlaying ? '⏸️' : '▶️'}
                </span>
                <span className="font-semibold text-base sm:text-lg">
                {isPlaying ? 'Pause Audio' : 'Play Audio Message'}
                </span>
            </button>

            {/* Audio Element */}
            <audio
                ref={audioRef}
                onEnded={handleAudioEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={(e) => {
                    console.error('Audio error:', e);
                }}
                preload="auto"
                style={{ display: 'none' }}
            >
                <source src="/audio/anniversary-message.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Progress Bar */}
            <div className="mt-4 w-full max-w-md mx-auto">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 min-w-[40px]">
                        {formatTime(currentTime)}
                    </span>
                    <div className="flex-1 relative">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none 
                                [&::-webkit-slider-thumb]:w-4 
                                [&::-webkit-slider-thumb]:h-4 
                                [&::-webkit-slider-thumb]:rounded-full 
                                [&::-webkit-slider-thumb]:bg-gradient-to-r 
                                [&::-webkit-slider-thumb]:from-pink-500 
                                [&::-webkit-slider-thumb]:to-purple-500
                                [&::-webkit-slider-thumb]:cursor-pointer
                                [&::-webkit-slider-thumb]:shadow-lg
                                [&::-webkit-slider-thumb]:hover:scale-110
                                [&::-webkit-slider-thumb]:transition-transform
                                [&::-moz-range-thumb]:w-4 
                                [&::-moz-range-thumb]:h-4 
                                [&::-moz-range-thumb]:rounded-full 
                                [&::-moz-range-thumb]:bg-gradient-to-r 
                                [&::-moz-range-thumb]:from-pink-500 
                                [&::-moz-range-thumb]:to-purple-500
                                [&::-moz-range-thumb]:border-0
                                [&::-moz-range-thumb]:cursor-pointer
                                [&::-moz-range-thumb]:shadow-lg"
                            style={{
                                background: `linear-gradient(to right, 
                                    rgb(236, 72, 153) 0%, 
                                    rgb(168, 85, 247) ${duration > 0 ? (currentTime / duration) * 100 : 0}%, 
                                    rgb(226, 232, 240) ${duration > 0 ? (currentTime / duration) * 100 : 0}%, 
                                    rgb(226, 232, 240) 100%)`
                            }}
                        />
                    </div>
                    <span className="text-xs text-slate-600 min-w-[40px] text-right">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
            </motion.div>

            {/* Back Button */}
            <div className="mt-6 sm:mt-8 text-center">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm sm:text-base text-slate-600 hover:text-pink-500 transition"
            >
                <span>←</span>
                <span>Kembali ke Home</span>
            </Link>
            </div>
        </Card>
                </div>
            </div>
        </div>
    );
}
