import Image from "next/image";

export default function Home() {
    return (

    <main className="max-w-full flex min-h-screen flex-col items-stretch justify-between p-12">

        <div className="border-2 border-indigo-300 bg-indigo-200 p-6">

            <div className="app-title">
                <code>Water reserves</code>
            </div>

            <div className="app-options">
                <div className="app-option">Αποθέματα νερού</div>
                <div className="app-option">Παραγωγή πόσιμου νερού</div>
                <div className="app-option">Λόγος αποθεμάτων / παραγωγής</div>
                <div className="app-option">Ποσότητες υετού</div>
            </div>
        </div>
    </main>

    );
}

