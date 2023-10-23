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
    return string.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


export const nonOptionProps = ['allowOffer', 'auctionStatusType', 'expirationTime', 'id', 'item', 'priceEventCurrency', 'priceGold', 'priceGoldIngot', 'priceGoldenKey', 'rarity'];