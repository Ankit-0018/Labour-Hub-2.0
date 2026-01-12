import ChooseRole from '@/components/sections/choose-role';
import recruitor from "@/assets/recruitor.jpg";
import labour from "@/assets/labour.jpg";
import type { role } from '@/components/sections/choose-role';

const roles : role[] = [
    {
        imgSrc : labour,
        title : "मुझे काम चाहिए/I need work"
    },
    {
        imgSrc : recruitor,
        title : "मुझे कर्मचारी चाहिए/I need workers"
    }
]

export default async function ChooseRolePage(){

    return <ChooseRole roles={roles} />
}