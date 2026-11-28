import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";

// People shown on the Company page. `photo: null` shows the person's initials until a photo is
// added under public/images/team/ (800×1000 JPEG, portrait).
const LEADERSHIP = [
  { name: "Teba Abel Kemba", role: "Chairman", photo: "/images/team/teba-abel-kemba.jpg" },
  { name: "Kemba Daniel Teba", role: "Chief Executive Officer and Founder", photo: "/images/team/kemba-daniel-teba.jpg" },
  { name: "Hellen Choweni", role: "Co-Founder", photo: "/images/team/hellen-choweni.jpg" },
  { name: "Stephen Chola", role: "Co-Founder", photo: "/images/team/stephen-chola.jpg" },
  { name: "Wilson Zulu", role: "Co-Founder", photo: "/images/team/wilson-zulu.jpg" },
  { name: "Ndi Denzel Ndang", role: "Chief Technology Officer", photo: "/images/team/ndi-denzel-ndang.jpg" },
  { name: "Narcisse Ndongkain", role: "Chief Information Officer", photo: "/images/team/narcisse-ndongkain.jpg" },
];

const TEAM = [
  { name: "Bekono Akono Marthe Lunya Lawrica", role: "Software Engineer", photo: "/images/team/bekono-akono-marthe-lunya-lawrica.jpg" },
  { name: "Chuye Princely Tata", role: "Software Engineer", photo: "/images/team/chuye-princely-tata.jpg" },
  { name: "Emarman Marie Virgine", role: "Digital Marketing", photo: "/images/team/emarman-marie-virgine.jpg" },
  { name: "Isaac Nkhoma", role: "Economist", photo: "/images/team/isaac-nkhoma.jpg" },
  { name: "Kang Fritz Andie", role: "Cybersecurity Engineer", photo: "/images/team/kang-fritz-andie.jpg" },
  { name: "Marie Doriane Edoa", role: "Secretary", photo: "/images/team/marie-doriane-edoa.jpg" },
  { name: "Muyunda Mwangala", role: "Research and Development", photo: "/images/team/muyunda-mwangala.jpg" },
];

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function PersonCard({ person, large = false }) {
  return (
    <figure className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-gray-light">
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.name}
            fill
            sizes={large ? "(min-width: 1024px) 360px, (min-width: 640px) 33vw, 50vw" : "(min-width: 1024px) 270px, 50vw"}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center font-display text-5xl text-brand-blue/70">
            {initials(person.name)}
          </div>
        )}
      </div>
      <figcaption className="mt-4">
        <p className={large ? "font-display text-lg text-brand-black" : "font-display text-base text-brand-black"}>
          {person.name}
        </p>
        {person.role && (
          <p className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-brand-blue uppercase">{person.role}</p>
        )}
      </figcaption>
    </figure>
  );
}

export function TeamSection() {
  return (
    <section id="team" className="border-t border-brand-line bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our team"
          title="The people behind Nkem Aeronautics"
          intro="Engineers, operators and business leaders building and supporting aerial solutions from Lusaka."
        />

        <h3 className="mt-14 text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase">Leadership</h3>
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-8">
          {LEADERSHIP.map((person) => (
            <PersonCard key={person.name} person={person} large />
          ))}
        </div>

        <h3 className="mt-16 text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase">Team</h3>
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {TEAM.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}
