import Button from "../Button"
import Input from "../Form/Input"
import Textarea from "../Form/Textarea"
import Popup from "../Popup";
import { Stack } from "@mui/material";


function SendMailPopup({onClose}) {
  return (
    <Popup title="Send Mail" onClose={onClose} width={370}>
        <Input label="Email Id" />
        <Input label="Subject" />
        <Textarea label="Description" />
        <Stack direction="row" spacing={1} justifyContent={"flex-end"} alignItems={"flex-end"}   >
            <Button size="fit" color="primary">Send</Button>
            <Button size="fit" color="light">Cancel</Button>
        </Stack>
    </Popup>
  )
}

export default SendMailPopup