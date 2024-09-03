'use server' 

const getNextFourDays = async(firstDay : Date) => {
    const fourDays: any[] = [];
    for (let i = 0; i < 4; i++) {
        const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
        date.setHours(0, 0, 0, 0);
        fourDays.push(date);
    }
    return fourDays;
};

export default getNextFourDays;