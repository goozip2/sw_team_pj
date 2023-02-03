--수정사항 반영 필요 (이후 수정 예정)

-- 1. User Table
CREATE TABLE USER (
	USER_ID VARCHAR(15) NOT NULL PRIMARY KEY, 
	USER_PASSWORD VARCHAR(40) NOT NULL
);
/* +) primary key는 애초에 not null인데 명시가 필요한가? */



-- 2. Diary Table
CREATE TABLE DIARY (
	DIARY_ID INT NOT NULL PRIMARY KEY,
	DIARY_WRITER_ID CHAR(15) NOT NULL,
	DIARY_CONTENT VARCHAR(20000) NOT NULL,
	DIARY_EMOTION VARCHAR(20) NOT NULL, -- 7가지
	DIARY_SITUATION VARCHAR(20) NOT NULL,
	DIARY_WRITE_DATE DATE NOT NULL,
	DIARY_YEAR INT NOT NULL,
	DIARY_MONTH INT NOT NULL,
	DIARY_DATE INT NOT NULL,
	DIARY_PLAYLIST INT NOT NULL,
	DIARY_SITE INT NOT NULL,

	 FOREIGN KEY (DIARY_WRITER_ID) REFERENCES USER(USER_ID),
	 FOREIGN KEY (DIARY_PLAYLIST) REFERENCES PLAYLIST(PLAYLIST_ID),
	 FOREIGN KEY (DIARY_SITE) REFERENCES SITE(SITE_ID)
);
/* +) varchar형의 max값은 65,535지만, UTF-8 인코딩을 사용할 경우, 최대값이 21844 */



-- 3. Site Table
CREATE TABLE SITE(
	SITE_ID INT NOT NULL PRIMARY KEY,
	SITE_URL VARCHAR(20000) NOT NULL,
	SITE_TITLE VARCHAR(30) NOT NULL,
	SITE_EMOTION VARCHAR(20) NOT NULL,
	SITE_SITUATION VARCHAR(20) NOT NULL
);
/* +) URL에 한글이 들어가는 경우도 있기에 일단 UTF-8 인코딩 사용으로 가정 후, 모델링 수행 */



-- 4. PlayList Table
CREATE TABLE PLAYLIST(
	PLAYLIST_ID INT NOT NULL PRIMARY KEY,
	PLAYLIST_URL VARCHAR(20000) NOT NULL,
	PLAYLIST_TITLE VARCHAR(100) NOT NULL,
	PLAYLIST_PRODUCER VARCHAR(50) NOT NULL,
	PLAYLIST_EMOTION VARCHAR(20) NOT NULL,
	PLAYLIST_SITUATION VARCHAR(20) NOT NULL
);



drop table user;
show tables;