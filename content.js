const imgUrl = chrome.runtime.getURL('urvi.png');
document.documentElement.style.setProperty('--urvi-bg', `url("${imgUrl}")`);
function store(category, url)
{   
    const date = new Date();
    const formattedDate =
        date.toLocaleDateString("en-GB");

    // ---------------- ANALYTICA ----------------

    chrome.storage.local.get(
        ["analytica"],
        (result) =>
        {
            let analytica =
                result.analytica || {};

            if (!analytica[formattedDate])
            {
                analytica[formattedDate] = {};
            }

            if (
                !analytica[formattedDate][category]
            )
            {
                analytica[formattedDate][category] =
                {
                    activetime: 0,
                    passivetime: 0,
                };
            }

            chrome.storage.local.set({
                analytica: analytica
            });

            console.log(
                "Analytica Updated:",
                analytica
            );
        if (category === "Entertainment") {
    if (analytica[formattedDate][category].activetime > 7200) {
       
        document.body.innerHTML = `
            <div id="blocked-screen">
                <h1>Entertainment Limit Reached</h1>
                <p>Daily entertainment limit exceeded (2 hours).</p>
               <a href=""> <button id="back-to-youtube">Go Back</button> </a>
            </div>
        `;
        const blockedScreen = document.getElementById('blocked-screen'); // or wherever you create it
const imgUrl = chrome.runtime.getURL('urvi.png');
blockedScreen.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${imgUrl}")`;
        
    }
}






        }
    );

    // ---------------- VIDEO ----------------

    chrome.storage.local.get(
        ["video"],
        (result) =>
        {
            let video = result.video || {};

            // NEW URL
            if (!video[url])
            {
                video[url] =
                {
                    category: category,
                    sessions: [],
                    totaltime: 0
                };
            }

            // EXISTING URL
            // keep old category
            // but ALWAYS create NEW SESSION

            if (!video[url].sessions)
            {
                video[url].sessions = [];
            }

            video[url].sessions.push({
                activetime: 0,
                passivetime: 0,
                timestamp: Date.now()
            });

            chrome.storage.local.set({
                video: video
            });

            console.log(
                "Video Updated:",
                video
            );
        }
    




    );
}

chrome.runtime.onMessage.addListener(
    (message) =>
    {
        if (
            message.action ===
            "Show_Category_Pop_Up"
        )
        {
            let video =
                document.querySelector("video");

            // safety check
            if (!video)
            {
                return;
            }

            // prevent duplicate popup
            if (
                document.getElementById(
                    "yt-category-popup"
                )
            )
            {
                return;
            }

            video.pause();

            const popup =
                document.createElement("div");

            popup.id =
                "yt-category-popup";

            popup.innerHTML = `

            <div class="popup-box">

                <h1>Select Category</h1>

                <div id="button-container">

                    <button>Quant</button>

                    <button>DSA</button>

                    <button>Development</button>

                    <button>Core Elec</button>

                    <button>Entertainment</button>

                </div>

            </div>

            `;

            document.body.appendChild(
                popup
            );


            const buttons =
                popup.querySelectorAll(
                    "button"
                );

            buttons.forEach((button) =>
            {
                button.addEventListener(
                    "click",
                    () =>
                    {
                        const category =
                            button.innerText;

                        store(
                            category,
                            message.url
                        );

                        popup.remove();

                        video.play();
                    }
                );
            });
        }
    }
);

// ---------------- PASSIVE CHECK ----------------

setInterval(() =>
{
    let video =
        document.querySelector("video");

    if (video)
    {
        if (
            !video.paused &&
            !video.ended &&
            video.currentTime > 0
        )
        {
            chrome.runtime.sendMessage({
                action: "checkPassive"
            });
        }
    }

}, 10000);