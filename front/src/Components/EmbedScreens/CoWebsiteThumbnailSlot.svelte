<script lang="ts">
    import { onMount } from "svelte";

    import { ICON_URL } from "../../Enum/EnvironmentVariable";
    import { mainCoWebsite } from "../../Stores/CoWebsiteStore";
    import { highlightedEmbedScreen } from "../../Stores/EmbedScreensStore";
    import type { CoWebsite } from "../../WebRtc/CoWebsite/CoWesbite";
    import { JitsiCoWebsite } from "../../WebRtc/CoWebsite/JitsiCoWebsite";
    import { BBBCoWebsite } from "../../WebRtc/CoWebsite/BBBCoWebsite";
    import { iframeStates } from "../../WebRtc/CoWebsiteManager";
    import { coWebsiteManager } from "../../WebRtc/CoWebsiteManager";

    import jitsiIcon from "../images/jitsi.png";
    import meetingIcon from "../images/meeting.svg";
    import { analyticsClient } from "../../Administration/AnalyticsClient";

    export let index: number;
    export let coWebsite: CoWebsite;
    export let vertical: boolean;

    let icon: HTMLImageElement;
    let iconLoaded = false;
    let state = coWebsite.getStateSubscriber();
    let isJitsi: boolean = coWebsite instanceof JitsiCoWebsite;
    let isBBB: boolean = coWebsite instanceof BBBCoWebsite;
    let isMeeting: boolean = isJitsi || isBBB;
    const mainState = coWebsiteManager.getMainStateSubscriber();

    onMount(() => {
        if (isJitsi) {
            icon.src = jitsiIcon;
        } else if (isBBB) {
            icon.src = meetingIcon;
        } else {
            icon.src = `${ICON_URL}/icon?url=${
                coWebsite.getUrl().hostname
            }&size=64..96..256&fallback_icon_color=14304c`;
        }
        icon.alt = coWebsite.getUrl().hostname;
        icon.onload = () => {
            iconLoaded = true;
        };
    });

    async function onClick() {
        if (vertical) {
            coWebsiteManager.goToMain(coWebsite);
        } else if ($mainCoWebsite) {
            if ($mainCoWebsite.getId() === coWebsite.getId()) {
                if (coWebsiteManager.getMainState() === iframeStates.closed) {
                    coWebsiteManager.displayMain();
                } else if ($highlightedEmbedScreen?.type === "cowebsite") {
                    coWebsiteManager.goToMain($highlightedEmbedScreen.embed);
                } else {
                    coWebsiteManager.hideMain();
                }
            } else {
                if (coWebsiteManager.getMainState() === iframeStates.closed) {
                    coWebsiteManager.goToMain(coWebsite);
                    coWebsiteManager.displayMain();
                } else {
                    highlightedEmbedScreen.toggleHighlight({
                        type: "cowebsite",
                        embed: coWebsite,
                    });
                }
            }
        }

        if ($state === "asleep") {
            await coWebsiteManager.loadCoWebsite(coWebsite);
        }

        coWebsiteManager.resizeAllIframes();
    }

    function noDrag() {
        return false;
    }

    let isHighlight: boolean = false;
    let isMain: boolean = false;
    $: {
        isMain =
            $mainState === iframeStates.opened &&
            $mainCoWebsite !== undefined &&
            $mainCoWebsite.getId() === coWebsite.getId();
        isHighlight =
            $highlightedEmbedScreen !== undefined &&
            $highlightedEmbedScreen?.type === "cowebsite" &&
            $highlightedEmbedScreen?.embed.getId() === coWebsite.getId();
    }
</script>

<div
    id={"cowebsite-thumbnail-" + index}
    class="cowebsite-thumbnail nes-pointer"
    class:asleep={$state === "asleep"}
    class:loading={$state === "loading"}
    class:ready={$state === "ready"}
    class:displayed={isMain || isHighlight}
    class:vertical
    on:click={() => analyticsClient.stackOpenCloseMultiIframe()}
    on:click={onClick}
>
    <img
        class="cowebsite-icon noselect nes-pointer"
        class:hide={!iconLoaded}
        class:meeting={isMeeting}
        bind:this={icon}
        on:dragstart|preventDefault={noDrag}
        alt=""
    />
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        class="cowebsite-icon"
        class:hide={iconLoaded}
        style="margin: auto; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; shape-rendering: auto;"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
    >
        <rect x="19" y="19" width="20" height="20" fill="#14304c">
            <animate
                attributeName="fill"
                values="#365dff;#14304c;#14304c"
                keyTimes="0;0.125;1"
                dur="1s"
                repeatCount="indefinite"
                begin="0s"
                calcMode="discrete"
            />
        </rect><rect x="40" y="19" width="20" height="20" fill="#14304c">
            <animate
                attributeName="fill"
                values="#365dff;#14304c;#14304c"
                keyTimes="0;0.125;1"
                dur="1s"
                repeatCount="indefinite"
                begin="0.125s"
                calcMode="discrete"
            />
        </rect><rect x="61" y="19" width="20" height="20" fill="#14304c">
            <animate
                attributeName="fill"
                values="#365dff;#14304c;#14304c"
                keyTimes="0;0.125;1"
                dur="1s"
                repeatCount="indefinite"
                begin="0.25s"
                calcMode="discrete"
            />
        </rect><rect x="19" y="40" width="20" height="20" fill="#14304c">
            <animate
                attributeName="fill"
                values="#365dff;#14304c;#14304c"
                keyTimes="0;0.125;1"
                dur="1s"
                repeatCount="indefinite"
                begin="0.875s"
                calcMode="discrete"
            />
        </rect><rect x="61" y="40" width="20" height="20" fill="#14304c">
            <animate
                attributeName="fill"
                values="#365dff;#14304c;#14304c"
                keyTimes="0;0.125;1"
                dur="1s"
                repeatCount="indefinite"
                begin="0.375s"
                calcMode="discrete"
            />
        </rect><rect x="19" y="61" width="20" height="20" fill="#14304c">
            <animate
                attributeName="fill"
                values="#365dff;#14304c;#14304c"
                keyTimes="0;0.125;1"
                dur="1s"
                repeatCount="indefinite"
                begin="0.75s"
                calcMode="discrete"
            />
        </rect><rect x="40" y="61" width="20" height="20" fill="#14304c">
            <animate
                attributeName="fill"
                values="#365dff;#14304c;#14304c"
                keyTimes="0;0.125;1"
                dur="1s"
                repeatCount="indefinite"
                begin="0.625s"
                calcMode="discrete"
            />
        </rect><rect x="61" y="61" width="20" height="20" fill="#14304c">
            <animate
                attributeName="fill"
                values="#365dff;#14304c;#14304c"
                keyTimes="0;0.125;1"
                dur="1s"
                repeatCount="indefinite"
                begin="0.5s"
                calcMode="discrete"
            />
        </rect>
    </svg>

    <!-- TODO use trigger message property -->
    <div class="cowebsite-hover" class:hide={!isMeeting} style="width: max-content;">
        <p>Open / Close meeting</p>
    </div>
</div>

<style lang="scss">
    .cowebsite-thumbnail {
        cursor: url("../../../style/images/cursor_pointer.png"), pointer;
        position: relative;
        padding: 0;
        background-color: rgba(#000000, 0.6);
        margin: 12px;
        margin-top: auto;
        margin-bottom: auto;

        &::before {
            content: "";
            position: absolute;
            width: 58px;
            height: 58px;
            left: -8px;
            top: -8px;

            margin: 4px;

            border-style: solid;
            border-width: 4px;
            border-image-slice: 3;
            border-image-width: 3;
            border-image-repeat: stretch;
            border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
            border-image-outset: 1;
        }

        &:not(.vertical) {
            transition: all 300ms;
            transform: translateY(0px);
        }

        &.vertical {
            margin: 7px;

            &::before {
                width: 48px;
                height: 48px;
            }

            .cowebsite-icon {
                width: 40px;
                height: 40px;
            }

            .cowebsite-hover {
                top: -4px;
                left: 55px;
            }

            animation: shake 0.35s ease-in-out;
        }

        &.displayed {
            &:not(.vertical) {
                transform: translateY(-15px);
            }
        }

        &.asleep {
            filter: grayscale(100%);
            --webkit-filter: grayscale(100%);
        }

        &.loading {
            animation: 2500ms ease-in-out 0s infinite alternate backgroundLoading;
        }

        &.ready {
            &::before {
                border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(38, 74, 110)" /></svg>');
            }
        }

        @keyframes backgroundLoading {
            0% {
                background-color: rgba(#000000, 0.6);
            }

            100% {
                background-color: #25598e;
            }
        }

        @keyframes bounce {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(-15px);
            }
        }

        @keyframes shake {
            0% {
                transform: translateX(0);
            }

            20% {
                transform: translateX(-10px);
            }

            40% {
                transform: translateX(10px);
            }

            60% {
                transform: translateX(-10px);
            }

            80% {
                transform: translateX(10px);
            }

            100% {
                transform: translateX(0);
            }
        }

        .cowebsite-icon {
            width: 50px;
            height: 50px;
            object-fit: cover;

            &.hide {
                display: none;
            }

            &.meeting {
                padding: 7px;
            }
        }

        &:hover {
            .cowebsite-hover {
                display: block;
                width: max-content !important;
            }
        }

        .cowebsite-hover {
            display: none;
            position: absolute;
            background-color: rgba(0, 0, 0, 0.6);
            top: -40px;
            left: -4px;
            width: 0 !important;
            min-height: 20px;
            transition: all 0.2s ease;
            overflow: hidden;
            color: white;
            padding: 4px;
            border-radius: 4px;

            p {
                margin-bottom: 0;
            }

            &.hide {
                display: none;
            }
        }
    }
</style>
