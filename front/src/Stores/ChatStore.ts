import { writable } from "svelte/store";
import { playersStore } from "./PlayersStore";
import type { PlayerInterface } from "../Phaser/Game/PlayerInterface";

export const chatVisibilityStore = writable(false);
export const chatInputFocusStore = writable(false);

export const newChatMessageStore = writable<string | null>(null);

export enum ChatMessageTypes {
    text = 1,
    me,
    userMoving,
}

export enum MoveEventType {
    in = 1,
    out,
}

export interface MoveEvent {
    type: MoveEventType;
    player: PlayerInterface;
}

export interface ChatMessage {
    type: ChatMessageTypes;
    date: Date;
    author?: PlayerInterface;
    targets?: MoveEvent[];
    text?: string[];
}

function getAuthor(authorId: number): PlayerInterface {
    const author = playersStore.getPlayerById(authorId);
    if (!author) {
        throw "Could not find data for author " + authorId;
    }
    return author;
}

function wasLessThanFiveminutesAgo(date: Date): boolean {
    return new Date().getTime() - date.getTime() < 5 * 60 * 1000;
}

function createChatMessagesStore() {
    const { subscribe, update } = writable<ChatMessage[]>([]);

    return {
        subscribe,
        addIncomingUser(authorId: number) {
            update((list) => {
                const lastMessage = list[list.length - 1];
                if (
                    lastMessage &&
                    lastMessage.type === ChatMessageTypes.userMoving &&
                    lastMessage.targets &&
                    wasLessThanFiveminutesAgo(lastMessage.date)
                ) {
                    lastMessage.targets.push({ type: MoveEventType.in, player: getAuthor(authorId) });
                } else {
                    list.push({
                        type: ChatMessageTypes.userMoving,
                        targets: [{ type: MoveEventType.in, player: getAuthor(authorId) }],
                        date: new Date(),
                    });
                }
                return list;
            });
        },
        addOutcomingUser(authorId: number) {
            update((list) => {
                const lastMessage = list[list.length - 1];
                if (
                    lastMessage &&
                    lastMessage.type === ChatMessageTypes.userMoving &&
                    lastMessage.targets &&
                    wasLessThanFiveminutesAgo(lastMessage.date)
                ) {
                    lastMessage.targets.push({ type: MoveEventType.out, player: getAuthor(authorId) });
                } else {
                    list.push({
                        type: ChatMessageTypes.userMoving,
                        targets: [{ type: MoveEventType.out, player: getAuthor(authorId) }],
                        date: new Date(),
                    });
                }
                return list;
            });
        },
        addPersonnalMessage(text: string) {
            newChatMessageStore.set(text);
            update((list) => {
                const lastMessage = list[list.length - 1];
                if (
                    lastMessage &&
                    lastMessage.type === ChatMessageTypes.me &&
                    lastMessage.text &&
                    wasLessThanFiveminutesAgo(lastMessage.date)
                ) {
                    lastMessage.text.push(text);
                } else {
                    list.push({
                        type: ChatMessageTypes.me,
                        text: [text],
                        date: new Date(),
                    });
                }
                return list;
            });
        },
        addExternalMessage(authorId: number, text: string) {
            update((list) => {
                const lastMessage = list[list.length - 1];
                if (
                    lastMessage &&
                    lastMessage.type === ChatMessageTypes.text &&
                    lastMessage.text &&
                    wasLessThanFiveminutesAgo(lastMessage.date)
                ) {
                    lastMessage.text.push(text);
                } else {
                    list.push({
                        type: ChatMessageTypes.text,
                        text: [text],
                        author: getAuthor(authorId),
                        date: new Date(),
                    });
                }
                return list;
            });
            chatVisibilityStore.set(true);
        },
    };
}
export const chatMessagesStore = createChatMessagesStore();

export function getSubMenuId(playerName: string, line: number, index: number): string {
    return playerName + "-" + line + "-" + index;
}

function createChatSubMenuVisibilityStore() {
    const { subscribe, update } = writable<string>("");

    return {
        subscribe,
        openSubMenu(playerName: string, line: number, index: number) {
            const id = getSubMenuId(playerName, line, index);
            update((oldValue) => {
                return oldValue === id ? "" : id;
            });
        },
    };
}

export const chatSubMenuVisbilityStore = createChatSubMenuVisibilityStore();