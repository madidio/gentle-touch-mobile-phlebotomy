import {VISIT_CHECKLIST} from '../../../shared/visit-checklist.mjs';
export default function VisitChecklist(){
 return <section className="my-8 rounded-2xl border border-border bg-white p-6" aria-labelledby="visit-checklist-heading"><h2 id="visit-checklist-heading" className="text-2xl font-semibold text-primary">Before your visit</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-foreground">{VISIT_CHECKLIST.map(item=><li key={item}>{item}</li>)}</ul></section>;
}
