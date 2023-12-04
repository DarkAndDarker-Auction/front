import axios from "axios";

export const sendNotification = async (receiverId, title, body, auctionItemId, notificationType, chatRoomId) => {
    try {
        const requestBody = {
            receiverId: receiverId,
            title: title,
            body: body,
            notificationType, notificationType,
            auctionItemId: auctionItemId,
            chatRoomId: chatRoomId
        }
        await axios.post('/notification/send', requestBody);
    } catch (error) {
        console.log(error.message);
    }
}

export const SOLD_OUT_NOTIFICATION_TITLE = "Item Sold Out";
export const SOLD_OUT_NOTIFICATION_BODY = "Your item just got sold out. Check your notification.";

export const OFFER_CONFIRMED_NOTIFICATION_TITLE = "Offer Confirmed";
export const OFFER_CONFIRMED_NOTIFICATION_BODY = "Your offer just got confirmed. Check your notification.";

export const NEW_OFFER_NOTIFICATION_TITLE = "Have new offer";
export const NEW_OFFER_NOTIFICATION_BODY = "You jsut got new offer. Check your notification.";