'use server' 

const getNextFourDays = async() => {
    const today = new Date();
    const fourDays: any[] = [];
    for (let i = 0; i < 4; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        date.setHours(0, 0, 0, 0);
        fourDays.push(date);
    }
    return fourDays;
};

export default getNextFourDays;