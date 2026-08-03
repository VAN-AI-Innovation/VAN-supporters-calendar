import { useMemo, useRef, useState } from 'react'
import './App.scss'

const DAY_ORDER = ['월요일', '화요일', '수요일', '목요일', '금요일']

const CROSS_CAMPUS = {
  월요일: ['최주영', '홍제형', '모승재', '한가은', '오유림', '김민지', '김민혁', '이예은', '김형주', '김지원', '유균성', '정지혜', '김민선'],
  화요일: ['오준영', '정수아', '박채원(5628)', '한예원', '최인우', '최민서', '박세희', '송경선', '이소담', '이다영', '임예슬', '조우영', '이지애'],
  수요일: ['김성태', '김민수', '김혜빈', '문솔', '안시형', '강다민', '주해연', '전종환', '김성민', '정세영', '이민주', '이은규'],
  목요일: ['김하영', '윤준오', '김은효', '강다연', '김민정', '최병현', '남경수', '김도영', '이해솔', '김예서', '류재현', '황서윤'],
  금요일: ['노지환', '김태은', '한이진', '권태성', '이규정', '박시언', '박채원(6733)', '임재은', '노원진', '백진규', '선민우', '이주연'],
}

const SCHOOL_TEAMS = {
  1: {
    days: ['월요일', '목요일'],
    members: ['홍제형', '문솔', '권태성', '이예은', '김민정', '최인우', '박채원(5628)', '김혜빈', '정세영', '김민지', '김하영', '강다연', '이해솔', '전종환', '임재은', '송경선', '최민서', '김민선', '최주영', '모승재', '한가은', '오유림', '김민혁', '김형주', '김지원', '유균성', '정지혜', '오준영', '정수아', '한예원', '박세희'],
  },
  2: {
    days: ['화요일', '금요일'],
    members: ['이은규', '최병현', '김태은', '노원진', '이규정', '박시언', '박채원(6733)', '한이진', '김도영', '이주연', '남경수', '조우영', '주해연', '안시형', '이소담', '이다영', '임예슬', '이지애', '김성태', '김민수', '강다민', '김성민', '이민주', '윤준오', '김은효', '김예서', '류재현', '황서윤', '노지환', '백진규', '선민우'],
  },
}

const CAMPAIGN_DATES = {
  월요일: ['9. 7'],
  화요일: ['9. 1', '9. 8'],
  수요일: ['9. 2', '9. 9'],
  목요일: ['9. 3', '9. 10'],
  금요일: ['9. 4', '9. 11'],
}

const IDENTITIES = {
  '박채원(5628)': { displayName: '박채원', suffix: '5628', school: '한국외국어대학교' },
  '박채원(6733)': { displayName: '박채원', suffix: '6733', school: '국립공주대학교' },
}

const DAY_SHORT = {
  월요일: '월',
  화요일: '화',
  수요일: '수',
  목요일: '목',
  금요일: '금',
}

const DAY_EN = {
  월요일: 'MON',
  화요일: 'TUE',
  수요일: 'WED',
  목요일: 'THU',
  금요일: 'FRI',
}

const CROSS_DAY_BY_PERSON = Object.fromEntries(
  Object.entries(CROSS_CAMPUS).flatMap(([day, names]) => names.map((name) => [name, day])),
)

const TEAM_BY_PERSON = Object.fromEntries(
  Object.entries(SCHOOL_TEAMS).flatMap(([team, data]) => data.members.map((name) => [name, Number(team)])),
)

const PEOPLE = DAY_ORDER.flatMap((day) => CROSS_CAMPUS[day]).map((id) => ({
  id,
  displayName: IDENTITIES[id]?.displayName ?? id,
  suffix: IDENTITIES[id]?.suffix,
  school: IDENTITIES[id]?.school,
  crossDay: CROSS_DAY_BY_PERSON[id],
  schoolTeam: TEAM_BY_PERSON[id],
}))

function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
    school: <><path d="m3 10 9-5 9 5-9 5-9-5Z"/><path d="M7 12v5c3 2 7 2 10 0v-5M21 10v6"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    x: <><path d="M18 6 6 18M6 6l12 12"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function getSearchText(person) {
  return [person.displayName, person.id, person.suffix, person.school].filter(Boolean).join(' ').toLowerCase()
}

function PersonResult({ person, onReset }) {
  const team = SCHOOL_TEAMS[person.schoolTeam]
  const crossDates = CAMPAIGN_DATES[person.crossDay]
  const schoolDates = team.days.flatMap((day) => CAMPAIGN_DATES[day]).sort((a, b) => Number(a.split('. ')[1]) - Number(b.split('. ')[1]))

  return (
    <section className="result-card" aria-live="polite">
      <div className="result-toolbar">
        <div className="workspace-title"><span></span><strong>Promotion workspace</strong><small>Schedule assigned</small></div>
        <button className="reset-button" type="button" onClick={onReset} aria-label="검색 결과 닫기"><Icon name="x" size={17} /></button>
      </div>

      <div className="result-profile">
        <div className="avatar">{person.displayName.slice(0, 1)}</div>
        <div>
          <p className="eyebrow">SUPPORTER PROFILE</p>
          <h3>{person.displayName}</h3>
          <p className="identity">홍보 담당{person.suffix ? ` · ${person.school} · ${person.suffix}` : ''}</p>
        </div>
        <span className="assigned-badge"><i></i> 배정 완료</span>
      </div>

      <div className="schedule-grid">
        <article className="schedule-module cross-assignment">
          <div className="module-header">
            <span><Icon name="globe" size={17} /></span>
            <strong>Cross-Campus</strong>
            <small>주 1회</small>
          </div>
          <div className="module-day"><strong>{person.crossDay}</strong><span>{DAY_EN[person.crossDay]}</span></div>
          <p>타 학교 커뮤니티에 게시</p>
          <div className="date-row">
            <span>집중 홍보 기간 게시일</span>
            <div>{crossDates.map((date) => <b key={date}>9월 {date.split('. ')[1]}일</b>)}</div>
          </div>
        </article>

        <article className="schedule-module school-assignment">
          <div className="module-header">
            <span><Icon name="school" size={17} /></span>
            <strong>자교 에브리타임</strong>
            <small>{person.schoolTeam}팀 · 주 2회</small>
          </div>
          <div className="module-day"><strong>{team.days.join(' · ')}</strong><span>{team.days.map((day) => DAY_EN[day]).join(' / ')}</span></div>
          <p>본인 소속 학교 에브리타임에 게시</p>
          <div className="date-row">
            <span>집중 홍보 기간 게시일</span>
            <div>{schoolDates.map((date) => <b key={date}>9월 {date.split('. ')[1]}일</b>)}</div>
          </div>
        </article>
      </div>

      <div className="campaign-progress">
        <div>
          <span>FOCUS PERIOD</span>
          <strong>9월 1일(화) — 9월 11일(금)</strong>
        </div>
        <div className="progress-track" aria-hidden="true"><i></i></div>
        <small>행사 직전 참가 신청 독려 집중 노출</small>
      </div>
    </section>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [showAllDays, setShowAllDays] = useState(false)
  const inputRef = useRef(null)

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/\s/g, '')
    if (!normalized) return []
    return PEOPLE.filter((person) => getSearchText(person).replace(/\s/g, '').includes(normalized))
  }, [query])

  const selectedPerson = PEOPLE.find((person) => person.id === selectedId)

  const selectPerson = (person) => {
    setSelectedId(person.id)
    setQuery(person.suffix ? `${person.displayName} (${person.suffix})` : person.displayName)
  }

  const resetSearch = () => {
    setQuery('')
    setSelectedId(null)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (matches.length === 1) selectPerson(matches[0])
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="VAN 홍보 캘린더 홈">
          <span className="brand-mark">A</span>
          <span>ARENA CREW</span>
        </a>
        <div className="header-meta"><span>VAN 2026</span><span>SEP 01—11</span></div>
      </header>

      <div className="page-shell" id="top">
        <section className="finder-section">
          <div className="finder-copy">
            <p className="section-number">01 · FIND MY SCHEDULE</p>
            <h2><span>내 이름으로</span><span>일정을 찾아보세요.</span></h2>
            <p>이름을 검색하면 게시해야 할 채널과 요일을 바로 확인할 수 있어요.</p>
          </div>

          <div className="finder-panel">
            <div className="scan-label">NAME SCAN</div>
            <form className={`search-box ${query && !selectedPerson ? 'is-active' : ''}`} onSubmit={handleSubmit}>
              <Icon name="search" size={23} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => { setQuery(event.target.value); setSelectedId(null) }}
                placeholder="이름을 입력해 주세요"
                aria-label="서포터즈 이름 검색"
                autoComplete="off"
              />
              {query && <button type="button" className="clear-button" onClick={resetSearch} aria-label="검색어 지우기"><Icon name="x" size={17} /></button>}
              <button className="search-button" type="submit" aria-label="검색"><span>검색</span><Icon name="arrow" size={18} /></button>
            </form>

            {!query && !selectedPerson && (
              <>
                <div className="search-hint"><Icon name="users" size={17} /><span>62명의 최종 배정 명단에서 검색합니다.</span></div>
                <div className="workspace-preview" aria-hidden="true">
                  <div className="preview-topline"><span><i></i> Assignment system</span><small>LIVE</small></div>
                  <div className="preview-grid">
                    <div><span>SUPPORTERS</span><strong>62</strong><small>전원 최종 배정</small></div>
                    <div><span>CROSS-CAMPUS</span><strong>1×</strong><small>주 1회 게시</small></div>
                    <div><span>EVERYTIME</span><strong>2×</strong><small>주 2회 게시</small></div>
                  </div>
                </div>
              </>
            )}

            {query && !selectedPerson && (
              <div className="match-list" role="listbox" aria-label="검색 결과">
                {matches.length > 0 ? matches.map((person) => (
                  <button key={person.id} type="button" onClick={() => selectPerson(person)}>
                    <span className="mini-avatar">{person.displayName[0]}</span>
                    <span className="match-identity">
                      <strong>{person.displayName}{person.suffix && ` (${person.suffix})`}</strong>
                      <small>{person.school ?? `Cross-Campus ${person.crossDay} · 자교 ${person.schoolTeam}팀`}</small>
                    </span>
                    <Icon name="chevron" size={18} />
                  </button>
                )) : (
                  <div className="no-result">
                    <span>“{query}”</span>와 일치하는 이름이 없습니다.<small>띄어쓰기와 이름을 다시 확인해 주세요.</small>
                  </div>
                )}
              </div>
            )}

            {selectedPerson && <PersonResult person={selectedPerson} onReset={resetSearch} />}
          </div>
        </section>

        <section className="intro">
          <div className="intro-copy">
            <p className="kicker"><span></span> ARENA CREW · 서포터즈 홍보 스케줄</p>
            <h1>2026 VAN 컨퍼런스<br className="desktop-break" /> 홍보 캘린더 <em>(총 62명 최종 배정)</em></h1>
            <div className="description">
              <p><strong>총 62명의 서포터즈 전원</strong>이 공평하게 배정되었습니다.</p>
              <p>동명이인인 <strong>박채원(5628 - 한국외대)</strong> 님과 <strong>박채원(6733 - 국립공주대)</strong> 님을 전화번호 뒷자리로 명확히 구분하여 배정했습니다.</p>
              <p><strong>Cross-Campus 홍보(주 1회/인)</strong>는 요청해주신 원래 명단 순서대로 배치되었고, <strong>자교 에브리타임 홍보(주 2회/인)</strong>는 같은 학교 인원이 한날한시에 게시하여 피드가 중복/도배되지 않도록 1팀(월/목, 31명)과 2팀(화/금, 31명)으로 교대 배정했습니다.</p>
            </div>
          </div>

          <aside className="campaign-card" aria-label="집중 홍보 기간">
            <div className="campaign-label"><span></span> FOCUS PERIOD</div>
            <div className="campaign-month">SEP</div>
            <div className="campaign-days"><strong>01</strong><i></i><strong>11</strong></div>
            <p>2026 · 화요일—금요일</p>
          </aside>
        </section>

        <section className="focus-banner">
          <div><span className="fire-dot" aria-hidden="true"></span><strong>집중 홍보 기간 · 9월 1일(화) ~ 9월 11일(금)</strong></div>
        </section>

        <div className="legend-row">
          <div><span className="legend-dot blue"></span>Cross-Campus 홍보 <strong>주 1회</strong><small>(12~13명/일)</small></div>
          <div><span className="legend-dot orange"></span>자교 에브리타임 홍보 <strong>주 2회</strong><small>(1팀 31명 / 2팀 31명, 학교별 교대)</small></div>
        </div>

        <section className="weekly-section">
          <div className="section-heading">
            <div>
              <p className="section-number">02 · WEEKLY OVERVIEW</p>
              <h2>주간 요일별 배정</h2>
            </div>
            <button className="outline-button" type="button" onClick={() => setShowAllDays((value) => !value)}>
              {showAllDays ? '명단 접기' : '전체 명단 보기'} <Icon name="arrow" size={17} />
            </button>
          </div>

          <div className="week-grid">
            {DAY_ORDER.map((day, index) => {
              const team = day === '월요일' || day === '목요일' ? 1 : day === '화요일' || day === '금요일' ? 2 : null
              return (
                <article className="day-card" key={day}>
                  <div className="day-card-head">
                    <span className="day-index">0{index + 1}</span>
                    <span className="day-short">{DAY_SHORT[day]}</span>
                  </div>
                  <h3>{day}</h3>
                  <p className="date-caption">{CAMPAIGN_DATES[day].map((date) => `9/${date.split('. ')[1]}`).join(' · ')}</p>
                  <div className="day-stat cross-stat"><span></span><b>Cross-Campus</b><em>{CROSS_CAMPUS[day].length}명</em></div>
                  {team ? <div className="day-stat school-stat"><span></span><b>자교 에브리타임</b><em>{team}팀 · 31명</em></div> : <div className="day-stat empty-stat"><b>자교 홍보 없음</b></div>}
                  {showAllDays && (
                    <div className="day-members">
                      <strong>Cross-Campus</strong>
                      <p>{CROSS_CAMPUS[day].join(', ')}</p>
                      {team && <><strong>자교 에브리타임 · {team}팀</strong><p>{SCHOOL_TEAMS[team].members.join(', ')}</p></>}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </div>

      <footer>
        <div className="footer-brand"><span className="brand-mark">A</span><strong>ARENA CREW</strong></div>
        <p>2026 VAN Conference · Supporters Promotion Calendar</p>
        <a href="#top">맨 위로 ↑</a>
      </footer>
    </main>
  )
}

export default App
