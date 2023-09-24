import {v4 as uuid} from "uuid";

export default () => {
    const uuid_val = ref("");
    onMounted(() => (uuid_val.value = uuid()));
    return uuid_val
}
