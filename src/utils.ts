const MAX_LEN = 5;

/**
 * Generate a random alphanumeric string of fixed length
 * @returns {string} - Randomly generated string
 */
export const generate = (): string => {
    let ans = "";
    const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
    for (let i = 0; i < MAX_LEN; i++) {
        ans += subset[Math.floor(Math.random() * subset.length)];
    }
    return ans;
};
