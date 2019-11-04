export const CREATE_TABLE_STARS = `
    CREATE TABLE IF NOT EXISTS stars (
        name TEXT PRIMARY KEY,
        \`order\` INTEGER,
        favoriteFlag INTEGER default 0
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
        videoId TEXT,
        starName TEXT,
        title TEXT,
        time TEXT,
        views NUMBER,
        thumbnailUrl TEXT,
        PRIMARY KEY(videoId, starName),
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const CREATE_TABLE_HOT_YOUTUBE = `
    CREATE TABLE IF NOT EXISTS hot_youtube (
        starName TEXT,
        rank NUMBER,
        videoId TEXT,
        PRIMARY KEY(starName, rank),
        FOREIGN KEY(starName) REFERENCES stars(name),
        FOREIGN KEY(videoId) REFERENCES youtube(videoId)
    );
`;

export const CREATE_TABLE_FAVORITE_YOUTUBE = `
    CREATE TABLE IF NOT EXISTS favorite_youtube (
        videoId TEXT,
        FOREIGN KEY(videoId) REFERENCES youtube(videoId)
    );
`;

export const CREATE_TABLE_TWITTER = `
    CREATE TABLE IF NOT EXISTS twitter (
        timelineUrl TEXT,
        starName TEXT,
        \`order\` INTEGER,
        tweetName TEXT,
        userName TEXT,
        PRIMARY KEY(starName, userName),
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const CREATE_TABLE_FACEBOOK = `
    CREATE TABLE IF NOT EXISTS facebook (
        timelineUrl TEXT,
        starName TEXT,
        \`order\` INTEGER,
        userName TEXT,
        PRIMARY KEY(starName, userName),
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const CREATE_TABLE_VLIVE = `
    CREATE TABLE IF NOT EXISTS vlive (
        vliveUrl TEXT,
        starName TEXT PRIMARY KEY,
        FOREIGN KEY(starName) REFERENCES stars(name)
    );
`;

export const CREATE_TABLE_APP = `
    CREATE TABLE IF NOT EXISTS app (
        executeCount INTEGER,
        rateFlag INTEGER
    );
`;

export const CREATE_TABLE_STREAMING_CHART = `
    CREATE TABLE IF NOT EXISTS streaming_chart (
        year INTEGER,
        month INTEGER,
        rank INTEGER,
        videoId TEXT,
        FOREIGN KEY(videoId) REFERENCES youtube(videoId)
    );
`;

export const SELECT_STARS = `
    SELECT * FROM stars ORDER BY \`order\` ASC LIMIT ?, ?
`;

export const SELECT_STARS_BY_NAME = `
    SELECT * FROM stars WHERE name LIKE ? ORDER BY \`order\` ASC LIMIT ?, ?
`;

export const SELECT_STARS_NAME = `
    SELECT name FROM stars ORDER BY \`order\` ASC
`;

export const SELECT_STAR_SITES = `
    SELECT * FROM star_sites WHERE starName = ?
`;

export const SELECT_STARS_COUNT = `
    SELECT COUNT(*) AS starsCount FROM stars
`;

export const SELECT_STARS_COUNT_BY_NAME = `
    SELECT COUNT(*) AS starsCount FROM stars WHERE name LIKE ?
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

export const UPDATE_FAVORITE_STARS = `
    UPDATE stars SET favoriteFlag = ? WHERE name = ?
`;

export const SELECT_FAVORITE_STARS_COUNT = `
    SELECT COUNT(*) AS starsCount FROM stars WHERE favoriteFlag = 1
`;

export const SELECT_FAVORITE_STARS = `
    SELECT * FROM stars WHERE favoriteFlag = 1 ORDER BY \`order\` ASC LIMIT ?, ?
`;

export const SELECT_FAVORITE_STARS_BY_NAME = `
    SELECT * FROM stars WHERE name LIKE ? AND favoriteFlag = 1 ORDER BY \`order\` ASC LIMIT ?, ?
`;

export const SELECT_FAVORITE_STARS_COUNT_BY_NAME = `
    SELECT COUNT(*) AS starsCount FROM stars WHERE name LIKE ? AND favoriteFlag = 1
`;

export const INSERT_FAVORITE_YOUTUBE = `
    INSERT OR REPLACE INTO favorite_youtube(videoId) VALUES(?)
`;

export const DELETE_FAVORITE_YOUTUBE = `
    DELETE FROM favorite_youtube WHERE videoId = ?
`;

export const SELECT_FAVORITE_YOUTUBE = `
    SELECT youtube.* FROM youtube INNER JOIN favorite_youtube ON youtube.videoId = favorite_youtube.videoId GROUP BY youtube.videoId ORDER BY youtube.views DESC LIMIT ?, ?
`;

export const SELECT_FAVORITE_YOUTUBE_COUNT = `
    SELECT COUNT(DISTINCT(youtube.videoId)) AS youtubeCount FROM youtube INNER JOIN favorite_youtube ON youtube.videoId = favorite_youtube.videoId
`;

export const SELECT_FAVORITE_YOUTUBE_STAR_NAME = `
    SELECT youtube.starName FROM youtube INNER JOIN favorite_youtube ON youtube.videoId = favorite_youtube.videoId GROUP BY youtube.starName
`;

export const INSERT_STARS = `
    INSERT OR REPLACE INTO stars(name, \`order\`, favoriteFlag) VALUES
    ('BTS', 1, (SELECT favoriteFlag FROM stars WHERE name = 'BTS')),
    ('BLACKPINK', 2, (SELECT favoriteFlag FROM stars WHERE name = 'BLACKPINK')),
    ('Twice', 3, (SELECT favoriteFlag FROM stars WHERE name = 'Twice')),
    ('EXO', 4, (SELECT favoriteFlag FROM stars WHERE name = 'EXO')),
    ('Got7', 5, (SELECT favoriteFlag FROM stars WHERE name = 'Got7')),
    ('Stray Kids', 6, (SELECT favoriteFlag FROM stars WHERE name = 'Stray Kids')),
    ('TXT(투모로우바이투게더)', 7, (SELECT favoriteFlag FROM stars WHERE name = 'TXT(투모로우바이투게더)')),
    ('Red Velvet', 8, (SELECT favoriteFlag FROM stars WHERE name = 'Red Velvet')),
    ('NCT 127', 9, (SELECT favoriteFlag FROM stars WHERE name = 'NCT 127')),
    ('NCT', 10, (SELECT favoriteFlag FROM stars WHERE name = 'NCT')),
    ('Seventeen', 11, (SELECT favoriteFlag FROM stars WHERE name = 'Seventeen')),
    ('iKON', 12, (SELECT favoriteFlag FROM stars WHERE name = 'iKON')),
    ('ATEEZ', 13, (SELECT favoriteFlag FROM stars WHERE name = 'ATEEZ')),
    ('MONSTA X', 14, (SELECT favoriteFlag FROM stars WHERE name = 'MONSTA X')),
    ('superM', 15, (SELECT favoriteFlag FROM stars WHERE name = 'superM')),
    ('Mamamoo', 16, (SELECT favoriteFlag FROM stars WHERE name = 'Mamamoo')),
    ('NCT Dream', 17, (SELECT favoriteFlag FROM stars WHERE name = 'NCT Dream')),
    ('NCT U', 18, (SELECT favoriteFlag FROM stars WHERE name = 'NCT U')),
    ('ITZY', 19, (SELECT favoriteFlag FROM stars WHERE name = 'ITZY')),
    ('SHINee', 20, (SELECT favoriteFlag FROM stars WHERE name = 'SHINee')),
    ('Astro', 21, (SELECT favoriteFlag FROM stars WHERE name = 'Astro')),
    ('(G)I-DLE', 22, (SELECT favoriteFlag FROM stars WHERE name = '(G)I-DLE')),
    ('EVERGLOW', 23, (SELECT favoriteFlag FROM stars WHERE name = 'EVERGLOW')),
    ('Pentagon', 24, (SELECT favoriteFlag FROM stars WHERE name = 'Pentagon')),
    ('KARD', 25, (SELECT favoriteFlag FROM stars WHERE name = 'KARD')),
    ('VAV', 26, (SELECT favoriteFlag FROM stars WHERE name = 'VAV')),
    ('Day6', 27, (SELECT favoriteFlag FROM stars WHERE name = 'Day6')),
    ('Super Junior', 28, (SELECT favoriteFlag FROM stars WHERE name = 'Super Junior')),
    ('IZ*ONE', 29, (SELECT favoriteFlag FROM stars WHERE name = 'IZ*ONE')),
    ('Girls Generation', 30, (SELECT favoriteFlag FROM stars WHERE name = 'Girls Generation')),
    ('EXO-CBX', 31, (SELECT favoriteFlag FROM stars WHERE name = 'EXO-CBX')),
    ('X1', 32, (SELECT favoriteFlag FROM stars WHERE name = 'X1')),
    ('GFriend(여자친구)', 33, (SELECT favoriteFlag FROM stars WHERE name = 'GFriend(여자친구)')),
    ('Winner', 34, (SELECT favoriteFlag FROM stars WHERE name = 'Winner')),
    ('EXID', 35, (SELECT favoriteFlag FROM stars WHERE name = 'EXID')),
    ('CLC', 36, (SELECT favoriteFlag FROM stars WHERE name = 'CLC')),
    ('IU(아이유)', 37, (SELECT favoriteFlag FROM stars WHERE name = 'IU(아이유)')),
    ('BtoB', 38, (SELECT favoriteFlag FROM stars WHERE name = 'BtoB')),
    ('NUEST', 39, (SELECT favoriteFlag FROM stars WHERE name = 'NUEST')),
    ('Chungha(청하)', 40, (SELECT favoriteFlag FROM stars WHERE name = 'Chungha(청하)')),
    ('Sunmi(선미)', 41, (SELECT favoriteFlag FROM stars WHERE name = 'Sunmi(선미)')),
    ('ONEUS', 42, (SELECT favoriteFlag FROM stars WHERE name = 'ONEUS')),
    ('AB6IX', 43, (SELECT favoriteFlag FROM stars WHERE name = 'AB6IX')),
    ('Apink', 44, (SELECT favoriteFlag FROM stars WHERE name = 'Apink')),
    ('Momoland', 45, (SELECT favoriteFlag FROM stars WHERE name = 'Momoland')),
    ('Ailee(에일리)', 46, (SELECT favoriteFlag FROM stars WHERE name = 'Ailee(에일리)')),
    ('The Boyz', 47, (SELECT favoriteFlag FROM stars WHERE name = 'The Boyz')),
    ('LOONA(이달의소녀)', 48, (SELECT favoriteFlag FROM stars WHERE name = 'LOONA(이달의소녀)')),
    ('SF9', 49, (SELECT favoriteFlag FROM stars WHERE name = 'SF9')),
    ('Dreamcatcher', 50, (SELECT favoriteFlag FROM stars WHERE name = 'Dreamcatcher')),
    ('The Rose', 51, (SELECT favoriteFlag FROM stars WHERE name = 'The Rose')),
    ('Hyuna(현아)', 52, (SELECT favoriteFlag FROM stars WHERE name = 'Hyuna(현아)')),
    ('Infinite', 53, (SELECT favoriteFlag FROM stars WHERE name = 'Infinite')),
    ('VIXX', 54, (SELECT favoriteFlag FROM stars WHERE name = 'VIXX')),
    ('PRISTIN', 55, (SELECT favoriteFlag FROM stars WHERE name = 'PRISTIN')),
    ('Weki Meki', 56, (SELECT favoriteFlag FROM stars WHERE name = 'Weki Meki')),
    ('AOA', 57, (SELECT favoriteFlag FROM stars WHERE name = 'AOA')),
    ('NFlying', 58, (SELECT favoriteFlag FROM stars WHERE name = 'NFlying')),
    ('fromis_9', 59, (SELECT favoriteFlag FROM stars WHERE name = 'fromis_9')),
    ('UP10TION(업텐션)', 60, (SELECT favoriteFlag FROM stars WHERE name = 'UP10TION(업텐션)')),
    ('Gugudan(구구단)', 61, (SELECT favoriteFlag FROM stars WHERE name = 'Gugudan(구구단)')),
    ('Oh My Girl(오마이걸)', 62, (SELECT favoriteFlag FROM stars WHERE name = 'Oh My Girl(오마이걸)')),
    ('1THE9', 63, (SELECT favoriteFlag FROM stars WHERE name = '1THE9')),
    ('Cherry Bullet', 64, (SELECT favoriteFlag FROM stars WHERE name = 'Cherry Bullet')),
    ('Golden Child', 65, (SELECT favoriteFlag FROM stars WHERE name = 'Golden Child')),
    ('Onewe', 66, (SELECT favoriteFlag FROM stars WHERE name = 'Onewe')),
    ('Rocket Punch', 67, (SELECT favoriteFlag FROM stars WHERE name = 'Rocket Punch')),
    ('Bolbbalgan4(볼빨간사춘기)', 68, (SELECT favoriteFlag FROM stars WHERE name = 'Bolbbalgan4(볼빨간사춘기)')),
    ('Lovelyz(러블리즈)', 69, (SELECT favoriteFlag FROM stars WHERE name = 'Lovelyz(러블리즈)')),
    ('Cosmic Girls(우주소녀)', 70, (SELECT favoriteFlag FROM stars WHERE name = 'Cosmic Girls(우주소녀)')),
    ('OnlyOneOf', 71, (SELECT favoriteFlag FROM stars WHERE name = 'OnlyOneOf')),
    ('VERIVERY', 72, (SELECT favoriteFlag FROM stars WHERE name = 'VERIVERY')),
    ('Teen Top', 73, (SELECT favoriteFlag FROM stars WHERE name = 'Teen Top')),
    ('DIA', 74, (SELECT favoriteFlag FROM stars WHERE name = 'DIA')),
    ('IN2IT', 75, (SELECT favoriteFlag FROM stars WHERE name = 'IN2IT')),
    ('GWSN(공원소녀)', 76, (SELECT favoriteFlag FROM stars WHERE name = 'GWSN(공원소녀)')),
    ('BVNDIT', 77, (SELECT favoriteFlag FROM stars WHERE name = 'BVNDIT')),
    ('WE IN THE ZONE(WITZ)', 78, (SELECT favoriteFlag FROM stars WHERE name = 'WE IN THE ZONE(WITZ)')),
    ('Laboum(라붐)', 79, (SELECT favoriteFlag FROM stars WHERE name = 'Laboum(라붐)')),
    ('VANNER', 80, (SELECT favoriteFlag FROM stars WHERE name = 'VANNER')),
    ('Nature', 81, (SELECT favoriteFlag FROM stars WHERE name = 'Nature')),
    ('Elris', 82, (SELECT favoriteFlag FROM stars WHERE name = 'Elris')),
    ('Berry Good', 83, (SELECT favoriteFlag FROM stars WHERE name = 'Berry Good'));
`;

export const INSERT_STAR_SITES = `
    INSERT OR REPLACE INTO star_sites(starName, blog, instagram, officialSite) VALUES
    ('(G)I-DLE', NULL, 'https://www.instagram.com/official_g_i_dle/', NULL),
    ('1THE9', NULL, 'https://www.instagram.com/official__1the9/', NULL),
    ('AB6IX', NULL, 'https://www.instagram.com/ab6ix_official/', NULL),
    ('AOA', NULL, 'https://www.instagram.com/official_team_aoa/', 'https://fncent.com/AOA/b/introduce/1303'),
    ('ATEEZ', NULL, 'https://www.instagram.com/ateez_official_/', 'http://ateez.kqent.com/'),
    ('Ailee(에일리)', NULL, 'https://www.instagram.com/aileeonline/', NULL),
    ('Apink', NULL, 'https://www.instagram.com/official.apink2011/', 'http://play-m.co.kr/apink'),
    ('Astro', 'https://www.instagram.com/officialASTRO/', NULL, 'http://cafe.daum.net/fantagio-boys'),
    ('BLACKPINK', NULL, 'https://www.instagram.com/blackpinkofficial/', 'https://www.ygfamily.com/artist/main.asp?LANGDIV=K&ATYPE=2&ARTIDX=70'),
    ('BTS', 'https://btsblog.ibighit.com/', 'https://www.instagram.com/bts.bighitofficial/', 'https://ibighit.com/bts/'),
    ('BVNDIT', NULL, 'https://www.instagram.com/bvndit_official/', 'http://mnhenter.com/'),
    ('Berry Good', NULL, 'https://www.instagram.com/berrygood_official/', 'http://jtgenter.com/bbs/group.php?gr_id=berrygood'),
    ('Bolbbalgan4(볼빨간사춘기)', NULL, 'https://www.instagram.com/official_bol4/', 'http://shofar-music.com/blush'),
    ('BtoB', NULL, 'https://www.instagram.com/cube_official_btob/', 'http://www.cubeent.co.kr/btob'),
    ('CLC', NULL, 'https://www.instagram.com/cube_clc_official/', NULL),
    ('Cherry Bullet', NULL, 'https://www.instagram.com/cherrybullet/', NULL),
    ('Chungha(청하)', NULL, 'https://www.instagram.com/chungha_official/', 'http://mnhenter.com/'),
    ('Cosmic Girls(우주소녀)', 'https://www.weibo.com/wjsn0225?is_hot=1', 'https://www.instagram.com/wjsn_cosmic/', NULL),
    ('DIA', 'https://www.weibo.com/diaofficial', 'https://www.instagram.com/mbk.dia/', NULL),
    ('Day6', NULL, 'https://www.instagram.com/DAY6kilogram/', 'https://day6.jype.com/'),
    ('Dreamcatcher', NULL, 'https://www.instagram.com/hf_dreamcatcher/', NULL),
    ('EVERGLOW', NULL, 'https://www.instagram.com/official_everglow/', 'http://cafe.daum.net/EVERGLOW'),
    ('EXID', NULL, 'https://www.instagram.com/exidofficial/', 'http://cafe.daum.net/exid'),
    ('EXO', 'https://www.weibo.com/weareoneexo?is_hot=1', 'https://www.instagram.com/weareone.exo/', 'http://exo.smtown.com/'),
    ('EXO-CBX', 'https://www.weibo.com/exocbx', 'https://www.instagram.com/weareone.exo/', 'http://exo-cbx.smtown.com/'),
    ('Elris', NULL, 'https://www.instagram.com/hunus_elris/', 'http://cafe.daum.net/elris.official'),
    ('GFriend(여자친구)', NULL, 'https://www.instagram.com/gfriendofficial/', 'http://cafe.daum.net/gfrdofficial'),
    ('GWSN(공원소녀)', NULL, 'https://www.instagram.com/kiwipop_gwsn/', NULL),
    ('Girls Generation', NULL, NULL, 'http://girlsgeneration.smtown.com/'),
    ('Golden Child', 'https://www.weibo.com/u/6246751871', 'https://www.instagram.com/official_gncd11/', 'http://www.woolliment.com/artists/main_goldenchild.php'),
    ('Got7', NULL, 'https://www.instagram.com/got7.with.igot7/', 'https://got7.jype.com/'),
    ('Gugudan(구구단)', 'https://www.weibo.com/gu9udan', 'https://www.instagram.com/gu9udan/', 'http://www.jelly-fish.co.kr/sub/artist_singer02.php?prof_id=32&num=6#a1'),
    ('Hyuna(현아)', NULL, 'https://www.instagram.com/hyunah_aa/', NULL),
    ('IN2IT', NULL, 'https://www.instagram.com/official_in2it/', NULL),
    ('ITZY', NULL, 'https://www.instagram.com/itzy.all.in.us/', 'https://itzy.jype.com/'),
    ('IU(아이유)', NULL, 'https://www.instagram.com/dlwlrma/', NULL),
    ('IZ*ONE', NULL, 'https://www.instagram.com/official_izone/', 'http://iz-one.co.kr/'),
    ('Infinite', NULL, 'https://www.instagram.com/official_ifnt_/', 'http://woolliment.phps.kr/artists/main_infinite.php'),
    ('KARD', NULL, 'https://www.instagram.com/official_kard/', 'http://www.dspmedia.co.kr/'),
    ('LOONA(이달의소녀)', NULL, 'https://www.instagram.com/loonatheworld/', 'http://www.loonatheworld.com/'),
    ('Laboum(라붐)', NULL, 'https://www.instagram.com/officiallaboum/', 'http://cafe.daum.net/officialLABOUM'),
    ('Lovelyz(러블리즈)', NULL, 'https://www.instagram.com/official_lvlz8_/', 'http://www.lvlz8.com/'),
    ('MONSTA X', 'https://www.weibo.com/monstax', 'https://www.instagram.com/official_monsta_x/', 'http://www.monstax-e.com/'),
    ('Mamamoo', NULL, 'https://www.instagram.com/mamamoo_official/', 'http://www.rbbridge.com/'),
    ('Momoland', NULL, 'https://www.instagram.com/momoland_official/', 'http://cafe.daum.net/MOMOLAND'),
    ('NCT', 'https://www.weibo.com/NCTsmtown?is_hot=1', 'https://www.instagram.com/nct/', 'http://www.nct2019.com/'),
    ('NCT 127', 'https://www.weibo.com/NCTsmtown', 'https://www.instagram.com/nct127/', 'http://nct127.smtown.com/'),
    ('NCT Dream', 'https://www.weibo.com/NCTDREAMsmtown?is_hot=1', 'https://www.instagram.com/nct_dream/', 'http://nctdream.smtown.com/'),
    ('NCT U', NULL, 'https://www.instagram.com/nct/', 'http://www.nct2018.com/'),
    ('NFlying', NULL, 'https://www.instagram.com/letsroll_nf/', 'https://fncent.com/NFlying/b/introduce/1559'),
    ('NUEST', NULL, 'https://www.instagram.com/nuest_official/', 'http://www.pledis.co.kr/html/artist/nuest'),
    ('Nature', NULL, 'https://www.instagram.com/nature.nchworld/', 'http://nature.nchworld.com/'),
    ('ONEUS', NULL, 'https://www.instagram.com/official_oneus/', NULL),
    ('Oh My Girl(오마이걸)', NULL, 'https://www.instagram.com/wm_ohmygirl/', 'http://ohmy-girl.com/omg_official/'),
    ('Onewe', NULL, 'https://www.instagram.com/official_onewe/', 'http://cafe.daum.net/makeasound0094'),
    ('OnlyOneOf', NULL, 'https://www.instagram.com/onlyoneofofficial/', 'http://onlyoneofofficial.com/'),
    ('PRISTIN', NULL, 'https://www.instagram.com/pristin_official_/', NULL),
    ('Pentagon', NULL, 'https://www.instagram.com/CUBE_PTG/', NULL),
    ('Red Velvet', 'https://www.weibo.com/RedVelvetofficial?is_hot=1', 'https://www.instagram.com/redvelvet.smtown/', 'http://redvelvet.smtown.com/'),
    ('Rocket Punch', NULL, 'https://www.instagram.com/official_rcpc_/', 'http://www.woolliment.com/artists/main_rocketpunch.php'),
    ('SF9', NULL, 'https://www.instagram.com/SF9official/', 'https://www.fncent.com/SF9/index.html?url=/SF9/b/introduce/18601'),
    ('SHINee', NULL, 'https://www.instagram.com/shinee/', 'http://shinee.smtown.com/'),
    ('Seventeen', NULL, 'https://www.instagram.com/saythename_17/', 'http://www.seventeen-17.com/'),
    ('Stray Kids', NULL, 'https://www.instagram.com/realstraykids/', 'https://straykids.jype.com/'),
    ('Sunmi(선미)', NULL, 'https://www.instagram.com/miyayeah/', NULL),
    ('Super Junior', 'https://www.weibo.com/superjunior', 'https://www.instagram.com/superjunior/', 'http://superjunior.smtown.com/Intro'),
    ('superM', NULL, 'https://www.instagram.com/superm/', 'https://www.supermofficial.com/'),
    ('TXT(투모로우바이투게더)', NULL, 'https://www.instagram.com/txt_bighit/', 'https://ibighit.com/txt/kor/'),
    ('Teen Top', 'https://www.weibo.com/teentopofficial', 'https://www.instagram.com/official_teentop/', 'http://itopgroup.com/bbs/page.php?hid=TEENTOP'),
    ('The Boyz', NULL, 'https://www.instagram.com/official_theboyz/', 'http://www.theboyz.kr/'),
    ('The Rose', NULL, 'https://www.instagram.com/official_therose/', 'https://jnstar.co.kr/'),
    ('Twice', NULL, 'https://www.instagram.com/twicetagram/', 'https://twice.jype.com/'),
    ('UP10TION(업텐션)', NULL, 'https://www.instagram.com/u10t_official/', 'http://itopgroup.com/bbs/page.php?hid=UP10TION'),
    ('VANNER', NULL, 'https://www.instagram.com/vanner__official/', 'https://www.vt-ent.com/'),
    ('VAV', NULL, 'https://www.instagram.com/vav_official/', 'http://www.ateament.co.kr/'),
    ('VERIVERY', NULL, 'https://www.instagram.com/the_verivery/', 'http://www.jelly-fish.co.kr/sub/artist_singer02.php?prof_id=48&num=5#a1'),
    ('VIXX', NULL, NULL, 'http://www.jelly-fish.co.kr/sub/artist_singer02.php?prof_id=26&num=3'),
    ('WE IN THE ZONE(WITZ)', NULL, 'https://www.instagram.com/we_inthe_zone/', NULL),
    ('Weki Meki', NULL, 'https://www.instagram.com/weki_meki/', NULL),
    ('Winner', NULL, 'https://www.instagram.com/winnercity/', 'https://www.ygfamily.com/artist/Main.asp?LANGDIV=K&ATYPE=2&ARTIDX=53'),
    ('X1', NULL, 'https://www.instagram.com/x1official101/', NULL),
    ('fromis_9', NULL, 'https://www.instagram.com/officialfromis_9/', 'https://fromisnine.com/'),
    ('iKON', NULL, 'https://www.instagram.com/withikonic/', 'https://www.ygfamily.com/artist/Main.asp?LANGDIV=K&ATYPE=2&ARTIDX=67');
`;

export const INSERT_TWITTER = `
    INSERT OR REPLACE INTO twitter(starName, \`order\`, userName, tweetName, timelineUrl) VALUES
    ('(G)I-DLE', 1, '(G)I-DLE·(여자)아이들', 'Tweets by G_I_DLE', 'https://twitter.com/G_I_DLE'),
    ('1THE9', 1, '1THE9(원더나인)', 'Tweets by official__1the9', 'https://twitter.com/official__1the9'),
    ('AB6IX', 2, 'AB6IX', 'Tweets by AB6IX', 'https://twitter.com/AB6IX'),
    ('AB6IX', 1, 'AB6IX_MEMBERS', 'Tweets by AB6IX_MEMBERS', 'https://twitter.com/AB6IX_MEMBERS'),
    ('AOA', 1, 'Official_AOA', 'Tweets by Official_AOA', 'https://twitter.com/Official_AOA'),
    ('ATEEZ', 1, 'ATEEZ(에이티즈)', 'Tweets by ATEEZofficial', 'https://twitter.com/ATEEZofficial'),
    ('Ailee(에일리)', 1, 'Ailee', 'Tweets by itzailee', 'https://twitter.com/itzailee'),
    ('Apink', 1, 'Apink 에이핑크', 'Tweets by Apink_2011', 'https://twitter.com/Apink_2011'),
    ('Astro', 1, '아스트로', 'Tweets by offclASTRO', 'https://twitter.com/offclASTRO'),
    ('BLACKPINK', 1, 'BLACKPINK GLOBAL BLINK', 'Tweets by ygofficialblink', 'https://twitter.com/ygofficialblink'),
    ('BTS', 4, 'BTS A.R.M.Y', 'Tweets by BTS_ARMY', 'https://twitter.com/BTS_ARMY'),
    ('BTS', 3, 'BTS WORLD Official', 'Tweets by BTSW_official', 'https://twitter.com/BTSW_official'),
    ('BTS', 2, 'BTS_official', 'Tweets by bts_bighit', 'https://twitter.com/bts_bighit'),
    ('BTS', 1, '방탄소년단', 'Tweets by BTS_twt', 'https://twitter.com/BTS_twt'),
    ('BVNDIT', 1, 'BVNDIT', 'Tweets by BVNDIT_official', 'https://twitter.com/BVNDIT_official'),
    ('Berry Good', 1, '베리굿(BerryGood)', 'Tweets by BerryGood2014', 'https://twitter.com/BerryGood2014'),
    ('Bolbbalgan4(볼빨간사춘기)', 1, 'BOL4_Official', 'Tweets by BOL4_Official', 'https://twitter.com/BOL4_Official'),
    ('Bolbbalgan4(볼빨간사춘기)', 2, '볼빨간사춘기', 'Tweets by bolbbalgan4', 'https://twitter.com/bolbbalgan4'),
    ('BtoB', 1, 'BTOB·비투비', 'Tweets by OFFICIALBTOB', 'https://twitter.com/OFFICIALBTOB'),
    ('CLC', 1, 'CLC·씨엘씨', 'Tweets by CUBECLC', 'https://twitter.com/CUBECLC'),
    ('Cherry Bullet', 1, 'Cherry Bullet', 'Tweets by cherrybullet', 'https://twitter.com/cherrybullet'),
    ('Chungha(청하)', 1, 'CHUNG HA', 'Tweets by CHUNGHA_MNHent', 'https://twitter.com/CHUNGHA_MNHent'),
    ('Cosmic Girls(우주소녀)', 2, 'WJSN DAILY', 'Tweets by WJSNDAILY', 'https://twitter.com/WJSNDAILY'),
    ('Cosmic Girls(우주소녀)', 1, '우주소녀', 'Tweets by WJSN_Cosmic', 'https://twitter.com/WJSN_Cosmic'),
    ('DIA', 1, '다이아 DIA', 'Tweets by dia_official', 'https://twitter.com/dia_official'),
    ('Day6', 1, 'DAY6', 'Tweets by day6official', 'https://twitter.com/day6official'),
    ('Dreamcatcher', 1, '드림캐쳐 Dreamcatcher', 'Tweets by hf_dreamcatcher', 'https://twitter.com/hf_dreamcatcher'),
    ('EVERGLOW', 1, 'EVERGLOW', 'Tweets by EVERGLOW_twt', 'https://twitter.com/EVERGLOW_twt'),
    ('EVERGLOW', 2, 'EVERGLOW GLOBAL', 'Tweets by EVERGLOW_GLOBAL', 'https://twitter.com/EVERGLOW_GLOBAL'),
    ('EXID', 1, 'EXID', 'Tweets by EXIDofficial', 'https://twitter.com/EXIDofficial'),
    ('EXO', 1, 'EXO', 'Tweets by weareoneEXO', 'https://twitter.com/weareoneEXO'),
    ('EXO', 3, 'EXO FANBASE', 'Tweets by EXOfanbase_Int', 'https://twitter.com/EXOfanbase_Int'),
    ('EXO', 2, 'EXO GLOBAL', 'Tweets by EXOGlobal', 'https://twitter.com/EXOGlobal'),
    ('EXO-CBX', 1, 'EXO', 'Tweets by weareoneEXO', 'https://twitter.com/weareoneEXO'),
    ('EXO-CBX', 3, 'EXO FANBASE', 'Tweets by EXOfanbase_Int', 'https://twitter.com/EXOfanbase_Int'),
    ('EXO-CBX', 2, 'EXO GLOBAL', 'Tweets by EXOGlobal', 'https://twitter.com/EXOGlobal'),
    ('Elris', 2, 'ELRIS International', 'Tweets by elris_int', 'https://twitter.com/elris_int'),
    ('Elris', 1, '엘리스(ELRIS)', 'Tweets by HUNUS_ELRIS', 'https://twitter.com/HUNUS_ELRIS'),
    ('GFriend(여자친구)', 1, '여자친구 GFRIEND', 'Tweets by GFRDofficial', 'https://twitter.com/GFRDofficial'),
    ('GFriend(여자친구)', 2, '여자친구 International', 'Tweets by GFRD_INT', 'https://twitter.com/GFRD_INT'),
    ('GWSN(공원소녀)', 1, '공원소녀 GWSN', 'Tweets by kiwipop_GWSN', 'https://twitter.com/kiwipop_gwsn'),
    ('Girls Generation', 2, 'Girls Generation', 'Tweets by SMTown_SNSD', 'https://twitter.com/SMTown_SNSD'),
    ('Golden Child', 1, 'GOLDEN CHILD', 'Tweets by Hi_Goldenness', 'https://twitter.com/Hi_Goldenness'),
    ('Got7', 1, 'GOT7', 'Tweets by GOT7Official', 'https://twitter.com/GOT7Official'),
    ('Gugudan(구구단)', 1, 'gugudan(구구단)', 'Tweets by gu9udan', 'https://twitter.com/gu9udan'),
    ('IN2IT', 2, 'IN2IT Global', 'Tweets by IN2IT_U', 'https://twitter.com/IN2IT_U'),
    ('IN2IT', 1, 'IN2IT 인투잇', 'Tweets by Official_IN2IT', 'https://twitter.com/Official_IN2IT'),
    ('ITZY', 1, 'ITZY', 'Tweets by ITZYofficial', 'https://twitter.com/ITZYofficial'),
    ('ITZY', 2, 'ITZY GLOBAL #ITzICY', 'Tweets by ITZY_GLOBAL', 'https://twitter.com/ITZY_GLOBAL'),
    ('IU(아이유)', 1, '아이유(IU) 공식 트위터', 'Tweets by _IUofficial', 'https://twitter.com/_IUofficial'),
    ('IZ*ONE', 2, 'IZ*ONE 아이즈원', 'Tweets by IZONE_DAILY', 'https://twitter.com/IZONE_DAILY'),
    ('IZ*ONE', 1, 'official_IZONE', 'Tweets by official_izone', 'https://twitter.com/official_izone'),
    ('Infinite', 2, 'INFINITE', 'Tweets by INFINITE_UM', 'https://twitter.com/INFINITE_UM'),
    ('Infinite', 1, 'INFINITE Official', 'Tweets by Official_IFNT', 'https://twitter.com/Official_IFNT'),
    ('KARD', 1, 'KARD', 'Tweets by KARD_Official', 'https://twitter.com/KARD_Official'),
    ('LOONA(이달의소녀)', 1, '이달의 소녀(LOOΠΔ)', 'Tweets by loonatheworld', 'https://twitter.com/loonatheworld'),
    ('Laboum(라붐)', 1, 'LABOUM 라붐', 'Tweets by officialLABOUM', 'https://twitter.com/officialLABOUM'),
    ('Lovelyz(러블리즈)', 1, 'Lovelyz_Official', 'Tweets by Official_LVLZ', 'https://twitter.com/Official_LVLZ'),
    ('MONSTA X', 1, '몬스타엑스_MONSTA X', 'Tweets by OfficialMonstaX', 'https://twitter.com/OfficialMonstaX'),
    ('Mamamoo', 1, '마마무(MAMAMOO)', 'Tweets by RBW_MAMAMOO', 'https://twitter.com/RBW_MAMAMOO'),
    ('Momoland', 1, '모모랜드_MOMOLAND', 'Tweets by MMLD_Official', 'https://twitter.com/MMLD_Official'),
    ('NCT', 1, 'NCT', 'Tweets by NCTsmtown', 'https://twitter.com/NCTsmtown'),
    ('NCT 127', 1, 'NCT 127', 'Tweets by NCTsmtown_127', 'https://twitter.com/NCTsmtown_127'),
    ('NCT Dream', 1, 'NCT DREAM', 'Tweets by NCTsmtown_DREAM', 'https://twitter.com/NCTsmtown_DREAM'),
    ('NCT U', 1, 'NCT', 'Tweets by NCTsmtown', 'https://twitter.com/NCTsmtown'),
    ('NFlying', 1, '엔플라잉 (N.Flying)', 'Tweets by NFlyingofficial', 'https://twitter.com/NFlyingofficial'),
    ('NUEST', 1, 'NUEST', 'Tweets by NUESTNEWS', 'https://twitter.com/NUESTNEWS'),
    ('Nature', 1, 'NATURE(네이처)', 'Tweets by nature_nchworld', 'https://twitter.com/nature_nchworld'),
    ('ONEUS', 1, 'ONEUS', 'Tweets by official_ONEUS', 'https://twitter.com/official_ONEUS'),
    ('Oh My Girl(오마이걸)', 1, '오마이걸 (OH MY GIRL)', 'Tweets by WM_OHMYGIRL', 'https://twitter.com/WM_OHMYGIRL'),
    ('Onewe', 1, 'ONEWE', 'Tweets by official_ONEWE', 'https://twitter.com/official_ONEWE'),
    ('OnlyOneOf', 1, 'OnlyOneOf official', 'Tweets by OnlyOneOf_twt', 'https://twitter.com/OnlyOneOf_twt'),
    ('PRISTIN', 1, 'GLASMIC(프리스틴)', 'Tweets by GLASMIC_OFICIAL', 'https://twitter.com/GLASMIC_OFICIAL'),
    ('Pentagon', 1, 'PENTAGON·펜타곤', 'Tweets by CUBE_PTG', 'https://twitter.com/CUBE_PTG'),
    ('Red Velvet', 1, 'Red Velvet', 'Tweets by RVsmtown', 'https://twitter.com/RVsmtown'),
    ('Rocket Punch', 2, 'ROCKET PUNCH GLOBAL', 'Tweets by RocketP_Global', 'https://twitter.com/RocketP_Global'),
    ('Rocket Punch', 1, 'Rocket Punch(로켓펀치)', 'Tweets by Official_RCPC', 'https://twitter.com/Official_RCPC'),
    ('SF9', 2, 'SF9 NATION', 'Tweets by SF9NATION', 'https://twitter.com/SF9NATION'),
    ('SF9', 1, 'SF9official', 'Tweets by SF9official', 'https://twitter.com/SF9official'),
    ('Seventeen', 1, '세븐틴(SEVENTEEN)', 'Tweets by pledis_17', 'https://twitter.com/pledis_17'),
    ('Stray Kids', 1, 'Stray Kids', 'Tweets by Stray_Kids', 'https://twitter.com/Stray_Kids'),
    ('Sunmi(선미)', 1, '선미 SUNMI', 'Tweets by official_sunmi_', 'https://twitter.com/official_sunmi_'),
    ('Super Junior', 1, 'SUPER JUNIOR', 'Tweets by SJofficial', 'https://twitter.com/SJofficial'),
    ('Super Junior', 2, '슈퍼주니어의WorldwideELFs', 'Tweets by worldwideelfs', 'https://twitter.com/worldwideelfs'),
    ('superM', 1, 'SuperM', 'Tweets by SuperM', 'https://twitter.com/superm'),
    ('TXT(투모로우바이투게더)', 1, 'TOMORROW X TOGETHER', 'Tweets by TXT_members', 'https://twitter.com/TXT_members'),
    ('TXT(투모로우바이투게더)', 2, 'TXT GLOBAL FANBASE', 'Tweets by 5TXT_GLOBAL', 'https://twitter.com/5TXT_GLOBAL'),
    ('Teen Top', 1, '틴탑(TEEN TOP)', 'Tweets by TEEN_TOP', 'https://twitter.com/TEEN_TOP'),
    ('The Boyz', 1, '더보이즈(THE BOYZ)', 'Tweets by Creker_THEBOYZ', 'https://twitter.com/Creker_THEBOYZ'),
    ('The Rose', 2, 'THE ROSE', 'Tweets by TheRoseGlobal', 'https://twitter.com/TheRoseGlobal'),
    ('The Rose', 1, '더로즈_The Rose', 'Tweets by TheRose_0803', 'https://twitter.com/TheRose_0803'),
    ('Twice', 1, 'TWICE', 'Tweets by JYPETWICE', 'https://twitter.com/JYPETWICE'),
    ('Twice', 3, 'TWICE GLOBAL', 'Tweets by TWICE_GLOBAL', 'https://twitter.com/TWICE_GLOBAL'),
    ('Twice', 2, 'TWICE JAPAN OFFICIAL', 'Tweets by JYPETWICE_JAPAN', 'https://twitter.com/JYPETWICE_JAPAN'),
    ('UP10TION(업텐션)', 1, '업텐션(UP10TION)', 'Tweets by UP10TION', 'https://twitter.com/UP10TION'),
    ('VANNER', 1, 'VANNER 배너', 'Tweets by VannerOfficial', 'https://twitter.com/VannerOfficial'),
    ('VAV', 1, 'VAV', 'Tweets by VAV_official', 'https://twitter.com/VAV_official'),
    ('VERIVERY', 1, 'VERIVERY', 'Tweets by by_verivery', 'https://twitter.com/by_verivery'),
    ('VERIVERY', 2, 'VERIVERY_OFFICIAL', 'Tweets by the_verivery', 'https://twitter.com/the_verivery'),
    ('VIXX', 1, 'RealVIXX', 'Tweets by RealVIXX', 'https://twitter.com/RealVIXX'),
    ('WE IN THE ZONE(WITZ)', 1, 'WE IN THE ZONE(위인더존)', 'Tweets by WeInTheZone_twt', 'https://twitter.com/WeInTheZone_twt'),
    ('Weki Meki', 1, '위키미키', 'Tweets by WekiMeki', 'https://twitter.com/WekiMeki'),
    ('Winner', 1, 'YG WINNER 위너', 'Tweets by YG_WINNER', 'https://twitter.com/YG_WINNER'),
    ('X1', 1, 'X1', 'Tweets by x1official101', 'https://twitter.com/x1official101'),
    ('X1', 2, 'X1 (엑스원) TRANSLATIONS', 'Tweets by 101_UPDATE', 'https://twitter.com/101_UPDATE'),
    ('fromis_9', 1, 'fromis_9 [프로미스나인]', 'Tweets by realfromis_9', 'https://twitter.com/realfromis_9'),
    ('fromis_9', 2, '프로미스나인 fromis_9 INTL', 'Tweets by fromyou_9', 'https://twitter.com/fromyou_9'),
    ('iKON', 1, 'iKON GLOBAL iKONIC', 'Tweets by YG_iKONIC', 'https://twitter.com/YG_iKONIC');
`;

export const INSERT_FACEBOOK = `
    INSERT OR REPLACE INTO facebook(starName, \`order\`, userName, timelineUrl) VALUES
    ('(G)I-DLE', 3, 'G I-DLE - Jeon Soyeon 전소연', 'https://www.facebook.com/JSfascination/'),
    ('(G)I-DLE', 2, 'G I-DLE - Yuqi 우기', 'https://www.facebook.com/YuqiWorld/'),
    ('(G)I-DLE', 1, 'G I-DLE 여자아이들', 'https://www.facebook.com/G.I.DLE.CUBE'),
    ('1THE9', 1, '1THE9 - 원더나인', 'https://www.facebook.com/official.1the9/'),
    ('AB6IX', 1, 'AB6IX', 'https://www.facebook.com/AB6IX'),
    ('AOA', 1, 'AOA', 'https://www.facebook.com/OfficialAOA'),
    ('AOA', 2, 'AOA Seolhyun', 'https://www.facebook.com/AOASeolhyun.Fans.Worldwide/'),
    ('ATEEZ', 1, 'ATEEZ', 'https://www.facebook.com/ATEEZofficial/'),
    ('ATEEZ', 4, 'ATEEZ - SONGMINGI', 'https://www.facebook.com/ATEEZ-SONG-MINGI-990419964487096/'),
    ('ATEEZ', 2, 'ATEEZ - Wooyoung', 'https://www.facebook.com/ATEEZWooyoung/'),
    ('ATEEZ', 3, 'ATEEZ - Yunho', 'https://www.facebook.com/atzyunho/'),
    ('Ailee(에일리)', 1, 'Ailee', 'https://www.facebook.com/Aileemusic'),
    ('Apink', 2, 'APink Naeun(나은)', 'https://www.facebook.com/sonaegi0210/'),
    ('Apink', 3, 'Apink panda worldwide', 'https://www.facebook.com/Apink-panda-worldwide-486103948625363/'),
    ('Apink', 1, 'Apink 에이핑크', 'https://www.facebook.com/Official.Apink2011'),
    ('Astro', 1, 'ASTRO 아스트로', 'https://www.facebook.com/offclASTRO'),
    ('BLACKPINK', 2, 'BLACK PINK - Jennie 제니', 'https://www.facebook.com/BlackPink.Jennie/'),
    ('BLACKPINK', 4, 'BLACK PINK - Jisoo 지수', 'https://www.facebook.com/BlackPink.Jisoo.kim/'),
    ('BLACKPINK', 3, 'BLACK PINK - Lisa 리사', 'https://www.facebook.com/BlackPink.Lisa.yg'),
    ('BLACKPINK', 5, 'BLACK PINK - Rose 로제', 'https://www.facebook.com/BlackPink.Rose.yg/'),
    ('BLACKPINK', 1, 'BLACKPINK', 'https://www.facebook.com/BLACKPINKOFFICIAL'),
    ('BTS', 2, 'BTS - Jungkook', 'https://www.facebook.com/Jungkook.Intl'),
    ('BTS', 1, '방탄소년단', 'https://www.facebook.com/bangtan.official'),
    ('BVNDIT', 1, 'BVNDIT', 'https://www.facebook.com/BVNDITOfficial'),
    ('Berry Good', 1, 'BERRY GOOD 베리굿', 'https://www.facebook.com/official.B2RRYGOOD'),
    ('Bolbbalgan4(볼빨간사춘기)', 1, '볼빨간사춘기', 'https://www.facebook.com/BOL4.Official'),
    ('BtoB', 1, 'BTOB 비투비', 'https://www.facebook.com/BTOBofficial/'),
    ('CLC', 2, 'CLC - Yujin', 'https://www.facebook.com/CrystaLClearYujin/'),
    ('CLC', 3, 'CLC International', 'https://www.facebook.com/CLCInternationalOfficial/'),
    ('CLC', 1, 'CLC 씨엘씨', 'https://www.facebook.com/CLC.UnitedCube'),
    ('Cherry Bullet', 1, 'Cherry Bullet', 'https://www.facebook.com/CherryBulletOfficial'),
    ('Chungha(청하)', 1, '청하 (CHUNG HA)', 'https://www.facebook.com/ChungHa.MNHent'),
    ('Cosmic Girls(우주소녀)', 4, 'Bona - WJSN 보나', 'https://www.facebook.com/WJSN.Bona.Jchan/'),
    ('Cosmic Girls(우주소녀)', 2, 'Eunseo - WJSN 은서', 'https://www.facebook.com/Eunseo-WJSN-%EC%9D%80%EC%84%9C-252560938472479/'),
    ('Cosmic Girls(우주소녀)', 3, 'SeolA 설아 WJSN', 'https://www.facebook.com/WJSNsSeolA/'),
    ('Cosmic Girls(우주소녀)', 1, '우주소녀_ WJSN', 'https://www.facebook.com/officialcosmicgirls'),
    ('DIA', 1, '다이아', 'https://www.facebook.com/mbk.dia'),
    ('Day6', 1, 'DAY6', 'https://www.facebook.com/day6official/'),
    ('Day6', 2, 'Day6 - Jae', 'https://www.facebook.com/Day6-Jae-431526563715990/'),
    ('Dreamcatcher', 1, '드림캐쳐 DREAMCATCHER', 'https://www.facebook.com/happyfacedreamcatcher'),
    ('EXID', 1, 'EXID_Official', 'https://www.facebook.com/EXIDOfficial'),
    ('EXID', 2, 'Hani - EXID', 'https://www.facebook.com/EXID.HaniAhn/'),
    ('EXID', 4, 'LE - EXID', 'https://www.facebook.com/LE-EXID-814661285256477/'),
    ('EXID', 3, '혜린이 어린이', 'https://www.facebook.com/hyelinikid/'),
    ('EXO', 1, 'EXO', 'https://www.facebook.com/weareoneEXO/'),
    ('EXO', 3, 'EXO - BAEK HYUN', 'https://www.facebook.com/BaekHyun.Exo/'),
    ('EXO', 2, 'EXO - Chanyeol', 'https://www.facebook.com/ChanYeol.SMentEXO/'),
    ('EXO', 10, 'EXO - Chen', 'https://www.facebook.com/CHEN.EXO/'),
    ('EXO', 9, 'EXO - D.O', 'https://www.facebook.com/DO.SMentEXO/'),
    ('EXO', 8, 'EXO - KAI', 'https://www.facebook.com/KAI.EXO/'),
    ('EXO', 7, 'EXO - Lay', 'https://www.facebook.com/Lay.EXO/'),
    ('EXO', 4, 'EXO - Se Hun', 'https://www.facebook.com/SeHun.EXO/'),
    ('EXO', 5, 'EXO - Su Ho', 'https://www.facebook.com/SuHo.SMentEXO/'),
    ('EXO', 6, 'EXO - TAO', 'https://www.facebook.com/TAO.EXO/'),
    ('EXO', 11, 'EXO - Xiu Min', 'https://www.facebook.com/XiuMin.Exo/'),
    ('EXO-CBX', 2, 'Baekhyun 백현', 'https://www.facebook.com/exokbyunbaekhyun/'),
    ('EXO-CBX', 1, 'EXO', 'https://www.facebook.com/weareoneEXO'),
    ('EXO-CBX', 3, 'EXO - Chen', 'https://www.facebook.com/CHEN.EXO/'),
    ('EXO-CBX', 4, 'EXO - Xiu Min', 'https://www.facebook.com/XiuMin.Exo/'),
    ('Elris', 1, '엘리스 ELRIS', 'https://www.facebook.com/elris.official'),
    ('GFriend(여자친구)', 3, 'Gfriend Eunha', 'https://www.facebook.com/CuteEunha/'),
    ('GFriend(여자친구)', 1, '여자친구 G-Friend', 'https://www.facebook.com/gfrdofficial'),
    ('GFriend(여자친구)', 2, '예린 여자친구 Yerin Gfriend', 'https://www.facebook.com/YerinJung819/'),
    ('GWSN(공원소녀)', 1, '공원소녀 GWSN', 'https://www.facebook.com/kiwipop.gwsn'),
    ('GWSN(공원소녀)', 2, '공원소녀 GWSN MIYA 미야', 'https://www.facebook.com/%EA%B3%B5%EC%9B%90%EC%86%8C%EB%85%80-GWSN-MIYA-%EB%AF%B8%EC%95%BC-953796728136860/'),
    ('Girls Generation', 3, 'Tiffany Young', 'https://www.facebook.com/Tiffanyyoungofficial/'),
    ('Girls Generation', 2, 'YOONA 윤아', 'https://www.facebook.com/limyoonacom/'),
    ('Girls Generation', 1, '소녀시대(Girls Generation)', 'https://www.facebook.com/girlsgeneration'),
    ('Golden Child', 1, 'Golden Child -골든 차일드', 'https://www.facebook.com/gncd11'),
    ('Golden Child', 2, 'Golden Child Y', 'https://www.facebook.com/Golden-Child-Y-175126309718086/'),
    ('Got7', 1, 'GOT7', 'https://www.facebook.com/GOT7Official'),
    ('Got7', 2, 'GOT7 - Jackson', 'https://www.facebook.com/GOT7Jacks0n/'),
    ('Got7', 4, 'GOT7 - Jaebum', 'https://www.facebook.com/GOT7Jaebumm/'),
    ('Got7', 5, 'GOT7 - Jinyoung', 'https://www.facebook.com/GOT7Jinyoungie/'),
    ('Got7', 3, 'GOT7 - Yugyeom', 'https://www.facebook.com/GOT7Yugye0m/'),
    ('Gugudan(구구단)', 1, '구구단 gugudan', 'https://www.facebook.com/gu9udan'),
    ('Hyuna(현아)', 1, 'HyunA 현아', 'https://www.facebook.com/hyunaofficial.pnation'),
    ('IN2IT', 1, 'IN2IT 인투잇', 'https://www.facebook.com/official.IN2IT'),
    ('ITZY', 1, 'ITZY', 'https://www.facebook.com/OfficialItzy/'),
    ('ITZY', 2, 'ITZY - Ryujin 류진', 'https://www.facebook.com/ITZYRyujiin/'),
    ('ITZY', 3, 'ITZY Yeji', 'https://www.facebook.com/Itzyhwangyeji0/'),
    ('ITZY', 4, 'ITZY Yuna', 'https://www.facebook.com/itzYunaa/'),
    ('IU(아이유)', 2, 'IU', 'https://www.facebook.com/UaenaForIU/'),
    ('IU(아이유)', 1, '아이유(iu)', 'https://www.facebook.com/iu.loen'),
    ('IZ*ONE', 1, 'IZ.ONE - 아이즈원', 'https://www.facebook.com/official.izone'),
    ('IZ*ONE', 2, 'IZ.ONE - 아이즈원 Kim Minju 김민주', 'https://www.facebook.com/KimMinjoofanpage/'),
    ('IZ*ONE', 3, 'IZONE - Yujin', 'https://www.facebook.com/Yujin.IZONE12/'),
    ('Infinite', 1, 'INFINITE', 'https://www.facebook.com/ifnt7'),
    ('KARD', 1, 'KARD', 'https://www.facebook.com/officialkard'),
    ('LOONA(이달의소녀)', 1, '이달의 소녀', 'https://www.facebook.com/loonatheworld'),
    ('Laboum(라붐)', 2, 'Ahn SolBin - 안솔빈 - LABOUM', 'https://www.facebook.com/solbinlaboum/'),
    ('Laboum(라붐)', 1, 'LABOUM 라붐', 'https://www.facebook.com/officialLABOUM'),
    ('Lovelyz(러블리즈)', 1, 'Lovelyz', 'https://www.facebook.com/lvlz8'),
    ('MONSTA X', 1, 'MONSTA X (몬스타엑스)', 'https://www.facebook.com/OfficialMonstaX'),
    ('Mamamoo', 1, '마마무 Mamamoo', 'https://www.facebook.com/RBW.MAMAMOO'),
    ('Momoland', 1, 'MOMOLAND', 'https://www.facebook.com/MOMOLANDOfficial'),
    ('Momoland', 5, 'Momoland Global Fans', 'https://www.facebook.com/mmldglobal/'),
    ('Momoland', 4, 'Momoland JooE - 이주원', 'https://www.facebook.com/MOMOLANDJooE.LeeJooWon/'),
    ('Momoland', 2, 'NANCY -Momoland', 'https://www.facebook.com/nancymmldofficial/'),
    ('Momoland', 3, 'Yeonwoo Momoland', 'https://www.facebook.com/Yeonwoo.Dublekick/'),
    ('NCT', 1, 'NCT', 'https://www.facebook.com/NCT.smtown'),
    ('NCT', 3, 'NCT - HAECHAN', 'https://www.facebook.com/NCT.HAECHAN.OFFICIAL/'),
    ('NCT', 4, 'NCT - Jisung', 'https://www.facebook.com/ParkJisungSMEntertainment/'),
    ('NCT', 2, 'NCT - Renjun', 'https://www.facebook.com/NCT2018HuangRenjun/'),
    ('NCT 127', 1, 'NCT 127', 'https://www.facebook.com/NCT127.smtown'),
    ('NCT 127', 2, 'NCT 127 - Jaehyun', 'https://www.facebook.com/adorablebabywoojae/'),
    ('NCT Dream', 1, 'NCT', 'https://www.facebook.com/NCT.smtown'),
    ('NCT Dream', 2, 'NCT Dream - Lee Jeno', 'https://www.facebook.com/NCTDream.LeeJeno/'),
    ('NCT U', 1, 'NCT', 'https://www.facebook.com/NCT.smtown'),
    ('NFlying', 2, 'N.Flying - Cha Hun', 'https://www.facebook.com/nflyinghun/'),
    ('NFlying', 1, 'NFlying', 'https://www.facebook.com/officialnflying'),
    ('NUEST', 1, '뉴이스트 Nuest', 'https://www.facebook.com/pledisnuest'),
    ('Nature', 1, 'NATURE', 'https://www.facebook.com/nature.nchworld'),
    ('ONEUS', 1, 'ONEUS', 'https://www.facebook.com/officialONEUS'),
    ('Oh My Girl(오마이걸)', 2, 'Oh My Girl 오마이걸 - Arin 아린', 'https://www.facebook.com/ohmygirlyewon/'),
    ('Oh My Girl(오마이걸)', 1, '오마이걸 OH MY GIRL', 'https://www.facebook.com/official.ohmygirl'),
    ('Onewe', 1, 'ONEWE', 'https://www.facebook.com/officialonewe'),
    ('OnlyOneOf', 1, 'Onlyoneofofficial', 'https://www.facebook.com/official.OnlyOneOf/'),
    ('Pentagon', 1, 'PENTAGON', 'https://www.facebook.com/pentagon.unitedcube'),
    ('Red Velvet', 1, '레드벨벳 (Red Velvet)', 'https://www.facebook.com/RedVelvet'),
    ('Rocket Punch', 1, 'Rocket Punch - 로켓펀치', 'https://www.facebook.com/rcpc06'),
    ('SF9', 1, 'SF9', 'https://www.facebook.com/SF9official'),
    ('SHINee', 1, '샤이니(SHINee)', 'https://www.facebook.com/shinee'),
    ('Seventeen', 1, 'SEVENTEEN', 'https://www.facebook.com/seventeennews'),
    ('Stray Kids', 1, 'Stray Kids', 'https://www.facebook.com/JYPEStrayKids'),
    ('Stray Kids', 3, 'Stray Kids - FELIX', 'https://www.facebook.com/felixJYPstraykids/'),
    ('Stray Kids', 2, 'Stray Kids - Seungmin', 'https://www.facebook.com/JYPEseungmin/'),
    ('Sunmi(선미)', 1, '선미 SUNMI', 'https://www.facebook.com/officialsunmi'),
    ('Super Junior', 1, '슈퍼주니어(Super Junior)', 'https://www.facebook.com/superjunior'),
    ('superM', 1, 'SuperM_smtown', 'https://www.facebook.com/SuperM'),
    ('TXT(투모로우바이투게더)', 1, 'TXT', 'https://www.facebook.com/TXT.bighit'),
    ('TXT(투모로우바이투게더)', 4, 'TXT - Beomgyu', 'https://www.facebook.com/txtbeomgyuu/'),
    ('TXT(투모로우바이투게더)', 3, 'TXT - Soobin', 'https://www.facebook.com/bighittxt.soobin/'),
    ('TXT(투모로우바이투게더)', 5, 'TXT - Taehyun', 'https://www.facebook.com/txttaehyunn/'),
    ('TXT(투모로우바이투게더)', 2, 'TXT - Yeonjun', 'https://www.facebook.com/bighittxtyeonjun/'),
    ('Teen Top', 1, 'TEEN TOP 틴탑', 'https://www.facebook.com/TeenzOnTopOfficial'),
    ('The Boyz', 1, '더보이즈(THE BOYZ)', 'https://www.facebook.com/officialTHEBOYZ'),
    ('The Rose', 1, 'The Rose 더로즈', 'https://www.facebook.com/bandtherose'),
    ('The Rose', 3, 'The Rose 더로즈 Worldwide', 'https://www.facebook.com/theroseworldwide/'),
    ('The Rose', 2, '잘샘김우성 Woo Sung The Rose 더로즈', 'https://www.facebook.com/jalsamkimwoosung/'),
    ('Twice', 1, 'TWICE', 'https://www.facebook.com/JYPETWICE'),
    ('Twice', 4, 'TWICE - Dahyun 다현', 'https://www.facebook.com/TWICEDahyun/'),
    ('Twice', 3, 'TWICE - Jihyo 지효', 'https://www.facebook.com/TWICEJihyo/'),
    ('Twice', 2, 'TWICE - Sana', 'https://www.facebook.com/welovesanaminatozaki/'),
    ('UP10TION(업텐션)', 4, 'UP10TION - Sunyoul', 'https://www.facebook.com/UP10TION.SUNYOUL/'),
    ('UP10TION(업텐션)', 3, 'UP10TION - Xiao', 'https://www.facebook.com/UP10TION.XIAO/'),
    ('UP10TION(업텐션)', 2, 'Up10tion - Wooshin / X1 - Wooseok', 'https://www.facebook.com/UP10TION.WOOSHIN.X1.WOOSEOK/'),
    ('UP10TION(업텐션)', 1, '업텐션 Up10tion', 'https://www.facebook.com/UP10TION'),
    ('VAV', 1, 'VAV', 'https://www.facebook.com/VAVofficial'),
    ('VERIVERY', 1, 'VERIVERY', 'https://www.facebook.com/theverivery'),
    ('VIXX', 1, 'VIXX', 'https://www.facebook.com/RealVIXX'),
    ('Weki Meki', 3, 'WEKI MEKI - Suyeon 수연', 'https://www.facebook.com/WekiMekiJiSuyeon/'),
    ('Weki Meki', 1, 'Weki Meki 위키미키', 'https://www.facebook.com/WekiMeki'),
    ('Weki Meki', 2, 'Yoojung - Weki Meki', 'https://www.facebook.com/Yoojung-Weki-Meki-687700411332795/'),
    ('Winner', 1, 'WINNER', 'https://www.facebook.com/OfficialYGWINNER'),
    ('Winner', 2, '강승윤', 'https://www.facebook.com/OfficialSEUNGYOON/'),
    ('X1', 3, 'Kim Yohan Latinoamérica', 'https://www.facebook.com/Kim-Yohan-Latinoam%C3%A9rica-416638572468410/'),
    ('X1', 2, 'Wooseok 김우석', 'https://www.facebook.com/KimWooseok101/'),
    ('X1', 4, 'X1 International', 'https://www.facebook.com/X1Intl/'),
    ('X1', 1, 'X1 엑스원', 'https://www.facebook.com/x1official101'),
    ('fromis_9', 1, 'fromis_9 (프로미스_9)', 'https://www.facebook.com/officialfromis9'),
    ('iKON', 3, 'IKON - Junhoe 구준회', 'https://www.facebook.com/IKON.Junhoe97/'),
    ('iKON', 1, 'iKON', 'https://www.facebook.com/OfficialYGiKON'),
    ('iKON', 2, 'iKON - B.I', 'https://www.facebook.com/OfficialHanbin/');
`;

export const INSERT_VLIVE = `
    INSERT OR REPLACE INTO vlive(starName, vliveUrl) VALUES
    ('(G)I-DLE', 'https://channels.vlive.tv/CE2621/home'),
    ('1THE9', 'https://channels.vlive.tv/B998B3/home'),
    ('AB6IX', 'https://channels.vlive.tv/B5D92B/home'),
    ('AOA', 'https://channels.vlive.tv/FEA11/home'),
    ('ATEEZ', 'https://channels.vlive.tv/C057DB/home'),
    ('Ailee(에일리)', 'https://channels.vlive.tv/FC855/home'),
    ('Apink', 'https://channels.vlive.tv/FDE29/home'),
    ('Astro', 'https://channels.vlive.tv/F6F107/home'),
    ('BLACKPINK', 'https://channels.vlive.tv/F001E5/home'),
    ('BTS', 'https://channels.vlive.tv/FE619/home'),
    ('BVNDIT', 'https://channels.vlive.tv/B4C94D/home'),
    ('Berry Good', 'https://channels.vlive.tv/E982B5/home'),
    ('Bolbbalgan4(볼빨간사춘기)', 'https://channels.vlive.tv/F38175/home'),
    ('BtoB', 'https://channels.vlive.tv/FD737/home'),
    ('CLC', 'https://channels.vlive.tv/F2E189/home'),
    ('Cherry Bullet', 'https://channels.vlive.tv/BC585B/home'),
    ('Chungha(청하)', 'https://channels.vlive.tv/E3437D/home'),
    ('Cosmic Girls(우주소녀)', 'https://channels.vlive.tv/F5F127/home'),
    ('DIA', 'https://channels.vlive.tv/F3D16B/home'),
    ('Day6', 'https://channels.vlive.tv/F4F147/home'),
    ('Dreamcatcher', 'https://channels.vlive.tv/E8D2CB/home'),
    ('EVERGLOW', 'https://channels.vlive.tv/B848DD/home'),
    ('EXID', 'https://channels.vlive.tv/F9BAF/home'),
    ('EXO', 'https://channels.vlive.tv/F94BD/home'),
    ('EXO-CBX', 'https://channels.vlive.tv/F94BD/home'),
    ('Elris', 'https://channels.vlive.tv/DED40B/home'),
    ('GFriend(여자친구)', 'https://channels.vlive.tv/F73FF/home'),
    ('GWSN(공원소녀)', 'https://channels.vlive.tv/C39773/home'),
    ('Girls Generation', 'https://channels.vlive.tv/FD53B/home'),
    ('Golden Child', 'https://channels.vlive.tv/E093D3/home'),
    ('Got7', 'https://channels.vlive.tv/ECDF/home'),
    ('Gugudan(구구단)', 'https://channels.vlive.tv/F0F1C7/home'),
    ('Hyuna(현아)', 'https://channels.vlive.tv/F071D7/home'),
    ('IN2IT', 'https://channels.vlive.tv/EFF1E7/home'),
    ('ITZY', 'https://channels.vlive.tv/BAE889/home'),
    ('IU(아이유)', 'https://channels.vlive.tv/FA895/home'),
    ('IZ*ONE', 'https://channels.vlive.tv/C1B7AF/home'),
    ('Infinite', 'https://channels.vlive.tv/FE815/home'),
    ('KARD', 'https://channels.vlive.tv/E6431D/home'),
    ('LOONA(이달의소녀)', 'https://channels.vlive.tv/E1F3A7/home'),
    ('Laboum(라붐)', 'https://channels.vlive.tv/EF81F5/home'),
    ('Lovelyz(러블리즈)', 'https://channels.vlive.tv/FB183/home'),
    ('MONSTA X', 'https://channels.vlive.tv/FE123/home'),
    ('Mamamoo', 'https://channels.vlive.tv/FCD4B/home'),
    ('Momoland', 'https://channels.vlive.tv/EF41FD/home'),
    ('NCT', 'https://channels.vlive.tv/F3C16D/home'),
    ('NCT 127', 'https://channels.vlive.tv/DEE409/home'),
    ('NCT Dream', 'https://channels.vlive.tv/DB547B/home'),
    ('NCT U', 'https://channels.vlive.tv/F3C16D/home'),
    ('NFlying', 'https://channels.vlive.tv/FC065/home'),
    ('NUEST', 'https://channels.vlive.tv/F59133/home'),
    ('Nature', 'https://channels.vlive.tv/C157BB/home'),
    ('ONEUS', 'https://channels.vlive.tv/C2D78B/home'),
    ('Oh My Girl(오마이걸)', 'https://channels.vlive.tv/F51143/home'),
    ('Onewe', 'https://channels.vlive.tv/BD1843/home'),
    ('OnlyOneOf', 'https://channels.vlive.tv/B199B3/home'),
    ('PRISTIN', 'https://channels.vlive.tv/EC1263/home'),
    ('Pentagon', 'https://channels.vlive.tv/F2C18D/home'),
    ('Red Velvet', 'https://channels.vlive.tv/DCF447/home'),
    ('Rocket Punch', 'https://channels.vlive.tv/B039DF/home'),
    ('SF9', 'https://channels.vlive.tv/ED7237/home'),
    ('SHINee', 'https://channels.vlive.tv/FD53B/home'),
    ('Seventeen', 'https://channels.vlive.tv/F99B3/home'),
    ('Stray Kids', 'https://channels.vlive.tv/D7A4F1/home'),
    ('Sunmi(선미)', 'https://channels.vlive.tv/DA6499/home'),
    ('Super Junior', 'https://channels.vlive.tv/FD53B/home'),
    ('superM', 'https://channels.vlive.tv/FD53B/home'),
    ('TXT(투모로우바이투게더)', 'https://channels.vlive.tv/BA18A3/home'),
    ('Teen Top', 'https://channels.vlive.tv/FD045/home'),
    ('The Boyz', 'https://channels.vlive.tv/DE341F/home'),
    ('The Rose', 'https://channels.vlive.tv/D69513/home'),
    ('Twice', 'https://channels.vlive.tv/EDBF/home'),
    ('UP10TION(업텐션)', 'https://channels.vlive.tv/FCF47/home'),
    ('VANNER', 'https://channels.vlive.tv/B6D90B/home'),
    ('VAV', 'https://channels.vlive.tv/E6A311/home'),
    ('VERIVERY', 'https://channels.vlive.tv/BC9853/home'),
    ('VIXX', 'https://channels.vlive.tv/FE41D/home'),
    ('WE IN THE ZONE(WITZ)', 'https://channels.vlive.tv/BA9893/home'),
    ('Weki Meki', 'https://channels.vlive.tv/E3B36F/home'),
    ('Winner', 'https://channels.vlive.tv/FDC2D/home'),
    ('X1', 'https://channels.vlive.tv/B049DD/home'),
    ('fromise_9', 'https://channels.vlive.tv/D5E529/home'),
    ('iKON', 'https://channels.vlive.tv/FD241/home');
`;