"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomButton } from "@/app/components/ui/CustomButton";
import { CustomTextField } from "@/app/components/ui/CustomTextField";

const schema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    phoneNumber: z
        .string()
        .min(1, "Phone number is required")
        .refine((val) => val.length === 10, {
            message: "Not a complete phone number",
        }),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Not a valid email address"),
});

const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length === 0) return "";
    if (digits.length < 4) return digits;
    if (digits.length < 7) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function Page() {

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: ""
        }
    });

    const phoneNumber = watch("phoneNumber")

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="bg-black flex min-h-screen flex-col p-6">
            <h1 className="text-center text-4xl pb-3">Attendee Agreement</h1>

            <div className="ml-16 mr-16">
                <p className="text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel augue sit amet felis scelerisque mollis nec quis risus. Curabitur lorem mauris, semper non aliquam et, cursus sed nisl. Cras dignissim vestibulum felis vel sodales. Cras mi ex, fermentum eget euismod eu, fermentum eget mauris. Ut a sapien vel enim placerat maximus. Nam tincidunt libero justo, non fermentum turpis ullamcorper non. In eget iaculis eros, a gravida purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus lectus tellus, vestibulum facilisis enim ornare, molestie dapibus sem. Praesent luctus ornare tortor finibus tempus. Morbi a ornare tellus. Maecenas eu viverra metus. Aliquam ligula nibh, gravida in tincidunt auctor, convallis ac lorem. Maecenas faucibus, erat in interdum cursus, nibh sem viverra nunc, in rutrum dolor est ut est. Aliquam convallis eleifend vehicula.

                    Duis risus libero, ultrices in elit in, eleifend lacinia enim. Praesent lacinia congue metus, quis sollicitudin ex posuere et. Nulla non ullamcorper nisl, at maximus velit. Vivamus nec dignissim dolor. Morbi est augue, auctor nec faucibus auctor, venenatis pulvinar quam. Pellentesque non arcu nec tellus tincidunt hendrerit. Donec ligula risus, consequat non pellentesque at, ultricies eget lacus. Fusce sed est quis ante condimentum aliquet. Etiam semper nisi egestas tellus pellentesque vestibulum. Integer in semper sem, et semper elit.

                    Maecenas bibendum arcu non pretium laoreet. Quisque ac neque posuere, eleifend justo vehicula, tristique neque. Phasellus cursus mauris a neque placerat accumsan. Vivamus at maximus leo. Etiam dui ligula, elementum ac lorem vitae, tempus porttitor leo. Maecenas tincidunt, nisl id dapibus auctor, eros tortor ornare dolor, in blandit dui risus non purus. Duis scelerisque purus iaculis, aliquam leo in, tristique tortor. Mauris ornare nisi dapibus justo bibendum eleifend. Sed erat velit, ornare convallis cursus non, viverra id justo. Nunc quis pulvinar eros, at porttitor elit. Praesent libero tortor, eleifend sed posuere sit amet, placerat sit amet nibh. Donec non varius nulla. Quisque nulla ipsum, semper at diam ut, mattis pellentesque nulla. Suspendisse potenti.

                    Vivamus sem magna, gravida eget auctor vitae, placerat in leo. Nulla pharetra consequat tempor. Vivamus consequat justo ipsum, a consectetur tortor eleifend vel. Nam pellentesque tellus turpis. Aliquam arcu eros, molestie id dapibus eget, auctor nec nulla. Nulla ut consectetur lectus, vitae rhoncus nisi. Integer pretium vehicula molestie. Etiam rhoncus gravida luctus. Sed enim urna, convallis sit amet ante ac, finibus interdum ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed dictum blandit lobortis. Nam consectetur eget mauris vel tristique.

                    Quisque libero sem, elementum vitae facilisis vel, sodales in eros. Vestibulum consequat dolor tortor, a elementum mauris ultricies in. Aliquam lectus nunc, porttitor quis sodales quis, vestibulum nec arcu. Nulla quam sem, fringilla cursus euismod ut, tincidunt in massa. Nam aliquam risus magna, vitae tempus erat porta quis. Sed fermentum porttitor sem id viverra. Aliquam et quam sit amet diam eleifend vulputate. Donec est turpis, consectetur in metus in, dapibus porta elit. Nullam eget felis eu dolor imperdiet viverra. Aenean ut ligula eu tellus cursus volutpat vitae id tortor. Fusce eu sodales nibh. Donec dapibus dolor eu blandit laoreet. Integer eget orci velit. Etiam feugiat elementum odio, a varius urna.
                </p>

            </div>

            <div className="flex gap-4 items-center justify-center pt-4 mb-8">
                <CustomTextField
                    label="First Name"
                    variant="standard"
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    required
                />

                <CustomTextField
                    label="Last Name"
                    variant="standard"
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    required
                />

                <CustomTextField
                    label="Phone Number"
                    variant="standard"
                    value={formatPhone(phoneNumber || "")}
                    onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setValue("phoneNumber", digits);
                    }}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    required
                    // for mobile
                    slotProps={{
                        htmlInput: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            maxLength: 14,
                        }
                    }}
                />

                <CustomTextField
                    label="Email"
                    variant="standard"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required />

                <CustomButton variant="contained" onClick={handleSubmit(onSubmit)}>
                    Submit
                </CustomButton>
            </div>
        </div>
    )
}