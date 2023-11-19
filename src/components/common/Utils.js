// email형식 확인
export const validateEmail = email => {
    const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return regex.test(email);
}

// 공백 제거
export const removeWhitespace = text => {
    const regex = /\s/g;
    return text.replace(regex, '');
}

export const capitalizeFirstLetter = string => {
    if (!string) {
        return;
    }
    return string.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
};

export const calculateReaminTime = (expirationTime) => {
    const currentTime = new Date();
    const expiration = new Date(expirationTime);

    const timeDifference = expiration - currentTime;

    if (timeDifference <= 0) {
        return "Auction Ended";
    }

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
};

export const formatTimeDifference = (offeredAt) => {
    const timestamp = new Date(offeredAt);
    const now = new Date();
    const timeDifference = now - timestamp;
    const hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
    const minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds

    if (hours > 0) {
        return `${hours}h ${minutes}m ago`;
    } else {
        return `${minutes}m ago`;
    }
}

export const formatLocalTime = (time) => {
    const timeDate = new Date(time);
    return timeDate.toLocaleString('en-US', { hour12: false }).replace(",", "");

}

export const currencyTypeList = [
    {
        key: "priceGold",
        name: "Gold",
        src: "https://darkanddarker.wiki.spellsandguns.com/images/1/1f/Gold_Coin.png"
    },
    {
        key: "priceGoldenKey",
        name: "Golden Key",
        src: "https://darkanddarker.wiki.spellsandguns.com/images/e/ec/Golden_Key.png"
    }, {
        key: "priceGoldIngot",
        name: "Gold Ingot",
        src: "https://darkanddarker.wiki.spellsandguns.com/images/2/22/Gold_Ingot.png"
    }, {
        key: "priceEventCurrency",
        name: "Event Currency",
        src: "https://darkanddarker.wiki.spellsandguns.com/images/d/d8/Golden_Teeth.png"
    },
]

export const nonOptionProps = ['allowOffer', 'auctionStatusType', 'expirationTime', 'offers', 'createdAt', 'lastModifiedDate',
    'id', 'item', 'priceEventCurrency', 'priceGold', 'priceGoldIngot', 'priceGoldenKey', 'rarity', 'inWishList', 'sellerId'];