import React from "react";
import Modal from "../Modal";
import "../../App.css";
import { useL3ttersContext } from "../../utils/GlobalState";

const bestScoreIndex = array => {
	let bestScore = 0;
	let bestIndex = [];
	array.forEach((element, index) => {
		if (element.score > bestScore) {
			bestScore = element.score;
			bestIndex = [index];
		} else if (element.score !== 0 && element.score === bestScore) {
			bestIndex.push(index);
		}
	});
	return bestIndex;
}

export default function Results({ 
	showResults, 
	setShowResults, 
	submissions,
	players
}) {
	
	const { round } = useL3ttersContext();
	
	const scoreIndex = bestScoreIndex(players);
	const pointsIndex = bestScoreIndex(submissions);
	
	if (!showResults)
		return (<></>);
	
  return (
		<Modal title={`Round ${round} results`} hideEnterButton={true} onClose={() => setShowResults(false)}>
			<div className="is-flex">
				<div className="is-flex-grow-2">{/* column 1 */}
					{submissions.map((submission, index) => (
					<div key={index}>
						<div className="has-text-centered">{submission.username}</div>
						<div className="has-text-centered is-size-4">
						{round % 2 ? 
							<>
							{submission.word}
							</>
						: 
							<>
							{submission.operationArr && `${submission.operationArr.join('')} = ${submission.total}`}
							</>
						}
						</div>
					</div>
					))}
				</div>
				<div className="is-flex-grow-1">{/* column 2 */}
					{submissions.map((submission, index) => (
					<div key={index}>
						<div className={`has-text-centered ${scoreIndex.includes(index) ? 'highlight' : ''}`}>{players[index].score}</div>
						<div className={`has-text-centered is-size-4 ${pointsIndex.includes(index) ? 'highlight' : ''}`}>{submission.score}</div>
					</div>
					))}
				</div>
				</div>
		</Modal>
  );
}
