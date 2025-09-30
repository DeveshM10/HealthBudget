import SymptomChecker from '../SymptomChecker';

export default function SymptomCheckerExample() {
  return (
    <div className="p-6">
      <SymptomChecker 
        onGetRecommendations={(symptoms, results) => console.log('Symptom analysis:', { symptoms, results })}
        onBookConsultation={(specialist) => console.log('Book consultation with:', specialist)}
      />
    </div>
  );
}