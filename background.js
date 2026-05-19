console.log(chrome.runtime.getURL('extension.png'));
console.log("Image loaded");
function updateActivetime(url)
{
    const today = new Date();

    const formattedDate =
        today.toLocaleDateString('en-GB');

    chrome.storage.local.get(
        ["video", "analytica"],
        (result) =>
    {
        let video = result.video || {};
        let analytica = result.analytica || {};

        let data = video[url];

        if (!data) return;

        if (
            !data.sessions ||
            data.sessions.length === 0
        ) return;

        let category = data.category;

        // create date object
        if (!analytica[formattedDate]) {

            analytica[formattedDate] = {};

        }

        // create category object
        if (!analytica[formattedDate][category]) {

            analytica[formattedDate][category] = {
                activetime: 0,
                passivetime: 0
            };

        }

        // total watch time
        data.totaltime += 10;

        let lastsession =
            data.sessions[data.sessions.length - 1];

        lastsession.activetime += 10;

        analytica[formattedDate][category]
            .activetime += 10;

        chrome.storage.local.set({
            video: video,
            analytica: analytica
        });
    });
}

function increasePassiveTime(url)
{
    const today = new Date();

    const formattedDate =
        today.toLocaleDateString('en-GB');

    chrome.storage.local.get(
        ["video", "analytica"],
        (result) =>
    {
        let video = result.video || {};
        let analytica = result.analytica || {};

        let data = video[url];

        if (!data) return;

        if (
            !data.sessions ||
            data.sessions.length === 0
        ) return;

        let category = data.category;

        // create date object
        if (!analytica[formattedDate]) {

            analytica[formattedDate] = {};

        }

        // create category object
        if (!analytica[formattedDate][category]) {

            analytica[formattedDate][category] = {
                activetime: 0,
                passivetime: 0
            };

        }

        // total watch time
        data.totaltime += 10;

        let lastsession =
            data.sessions[data.sessions.length - 1];

        lastsession.passivetime += 10;

        analytica[formattedDate][category]
            .passivetime += 10;

        chrome.storage.local.set({
            video: video,
            analytica: analytica
        });
    });
}


// show popup when youtube tab opens
chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) =>
{
    if (
        typeof changeInfo.url === "string" &&
        changeInfo.url.includes(
            "youtube.com/watch"
        )
    ) {

        chrome.tabs.sendMessage(
            tabId,
            {
                action: "Show_Category_Pop_Up",
                url: changeInfo.url
            }
        );

    }
});


// show popup for already opened tabs
chrome.tabs.query({}, (tabs) =>
{
    tabs.forEach((tab) =>
    {
        if (
            tab.url &&
            tab.url.includes(
                "youtube.com/watch"
            )
        ) {

            chrome.tabs.sendMessage(
                tab.id,
                {
                    action: "Show_Category_Pop_Up",
                    url: tab.url
                }
            );

        }
    });
});


// active time tracker
setInterval(() =>
{
    chrome.tabs.query(
    {
        active: true,
        currentWindow: true
    },
    (tabs) =>
    {
        const currentTab = tabs[0];

        if (!currentTab) return;

        if (!currentTab.url) return;

        if (
            currentTab.url.includes(
                "youtube.com/watch"
            )
        ) {

            updateActivetime(
                currentTab.url
            );

        }
    });

}, 10000);


// passive time tracker
chrome.runtime.onMessage.addListener(
    (message, sender) =>
{
    if (
        message.action ===
        "checkPassive"
    )
    {
        chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        (tabs) =>
        {
            let activeTab = tabs[0];

            if (
                activeTab &&
                sender.tab &&
                activeTab.id !== sender.tab.id
            )
            {
                increasePassiveTime(
                    sender.tab.url
                );
            }

        });
    }
});