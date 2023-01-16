export function namesToColor(firstName, lastName) {
    if (!firstName || !lastName) {
        return;
    }

    let fullName = `${firstName} ${lastName}`;
    let hash = 0;
    let i;
    for (i = 0; i < fullName.length; i += 1) {
        hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

export function getInitials(firstName, lastName) {
    if(firstName && lastName) {
        return  `${firstName[0]}${lastName[0]}`;
    }
}