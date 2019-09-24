export const CREATE_TABLE_UPDATE_STATUS = `
    CREATE TABLE IF NOT EXISTS update_status (
        tableName TEXT PRIMARY KEY,
        updateDate INTEGER
    );
`;

export const CREATE_TABLE_STARS = `
    CREATE TABLE IF NOT EXISTS stars (
        name TEXT PRIMARY KEY,
        \`order\` INTEGER,
        updateDate INTEGER
    );
`;

export const CREATE_TABLE_STAR_SITES = `
    CREATE TABLE IF NOT EXISTS star_sites (
        starName TEXT PRIMARY KEY,
        blog TEXT DEFAULT NULL,
        instagram TEXT DEFAULT NULL,
        officialSite TEXT DEFAULT NULL,
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const CREATE_TABLE_YOUTUBE = `
    CREATE TABLE IF NOT EXISTS youtube (
        videoId TEXT PRIMARY KEY,
        starName TEXT,
        \`order\` INTEGER,
        thumbnailUrl TEXT,
        time TEXT,
        title TEXT,
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const CREATE_TABLE_TWITTER = `
    CREATE TABLE IF NOT EXISTS twitter (
        timelineUrl TEXT PRIMARY KEY,
        starName TEXT,
        \`order\` INTEGER,
        tweetName TEXT,
        userName TEXT,
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const CREATE_TABLE_FACEBOOK = `
    CREATE TABLE IF NOT EXISTS facebook (
        timelineUrl TEXT PRIMARY KEY,
        starName TEXT,
        \`order\` INTEGER,
        userName TEXT,
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const CREATE_TABLE_VLIVE = `
    CREATE TABLE IF NOT EXISTS vlive (
        vliveUrl TEXT PRIMARY KEY,
        starName TEXT,
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const SELECT_UPDATE_DATE_BY_TABLE_NAME = `
    SELECT updateDate FROM update_status WHERE tableName = ?
`;

export const INSERT_STARS = `
    INSERT OR REPLACE INTO stars(name, \`order\`, updateDate) VALUES(?, ?, ?)
`;

export const INSERT_STAR_SITES = `
    INSERT OR REPLACE INTO star_sites(starName, blog, instagram, officialSite) VALUES(?, ?, ?, ?)
`;

export const INSERT_YOUTUBE = `
    INSERT OR REPLACE INTO youtube(videoId, starName, \`order\`, thumbnailUrl, time, title) VALUES(?, ?, ?, ?, ?, ?)
`;

export const INSERT_TWITTER = `
    INSERT OR REPLACE INTO twitter(timelineUrl, starName, \`order\`, tweetName, userName) VALUES(?, ?, ?, ?, ?)
`;

export const INSERT_FACEBOOK = `
    INSERT OR REPLACE INTO facebook(timelineUrl, starName, \`order\`, userName) VALUES(?, ?, ?, ?)
`;

export const INSERT_VLIVE = `
    INSERT OR REPLACE INTO vlive(vliveUrl, starName) VALUES(?, ?)
`;

export const INSERT_UPDATE_DATE_BY_TABLE_NAME = `
    INSERT OR REPLACE INTO update_status(tableName, updateDate) VALUES(?, ?)
`;

export const SELECT_STARS = `
    SELECT * FROM stars ORDER BY \`order\` ASC
`;

export const SELECT_STAR_SITES = `
    SELECT * FROM star_sites WHERE starName = ?
`;

export const SELECT_YOUTUBE = `
    SELECT * FROM youtube WHERE starName = ? ORDER BY \`order\` ASC
`;

export const SELECT_TWITTER = `
    SELECT * FROM twitter WHERE starName = ? ORDER BY \`order\` ASC
`;

export const SELECT_FACEBOOK = `
    SELECT * FROM facebook WHERE starName = ? ORDER BY \`order\` ASC
`;

export const SELECT_VLIVE = `
    SELECT * FROM vlive WHERE starName = ?
`;