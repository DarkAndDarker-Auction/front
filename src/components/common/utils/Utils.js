export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

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
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years}년 전`;
    } else if (months > 0) {
        return `${months}개월 전`;
    } else if (days > 0) {
        return `${days}일 전`;
    } else if (hours > 0) {
        return `${hours}시간 전`;
    } else if (minutes > 0) {
        return `${minutes}분 전`;
    } else {
        return `${seconds}초 전`;
    }
}

export const formatLocalTime = (time) => {
    const timeDate = new Date(time);
    return timeDate.toLocaleString('en-US', { hour12: false }).replace(",", "");
}

export const formatLocalTimeForMessage = (time) => {
    const originalDate = new Date(time);

    // UTC를 기준으로 시간을 가져옴
    const hoursUTC = originalDate.getUTCHours().toString().padStart(2, '0');
    const minutesUTC = originalDate.getUTCMinutes().toString().padStart(2, '0');

    return `${hoursUTC}:${minutesUTC}`;
}

export const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year} / ${month} / ${day}`;
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