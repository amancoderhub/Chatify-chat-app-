import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2, Wifi } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { conversationService } from "../../services/conversationService";
import { useSocketContext } from "../../contexts/SocketContext";
import Modal from "../ui/Modal";

const addConversationSchema = z.object({
    connectCode: z.string().trim().min(6, { message: "Invalid connect ID" }),
});

type AddConversationFormData = z.infer<typeof addConversationSchema>;

type ApiErrorResponse = {
    message?: string;
};

interface AddConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddConversationModal: React.FC<AddConversationModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { socket } = useSocketContext();
    const [connectCode, setConnectCode] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        reset,
    } = useForm<AddConversationFormData>({
        resolver: zodResolver(addConversationSchema),
        defaultValues: {
            connectCode: "",
        },
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/incompatible-library
        const subscription = watch((value) => {
            setConnectCode(value.connectCode || "");
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const { isFetching, refetch } = useQuery({
        queryKey: ["checkConnectCode", connectCode],
        queryFn: () => conversationService.checkConnectCode(connectCode),
        enabled: false,
        retry: false,
    });

    const onSubmit = async (formData: AddConversationFormData) => {
        const result = await refetch();

        if (result.data?.success) {
            socket?.emit("conversation:request", {
                connectCode: formData.connectCode,
            });
            onClose();
            reset();
        } else {
            const error = result.error as AxiosError<ApiErrorResponse> | null;
            toast.error(
                error?.response?.data?.message ?? "Invalid connect ID",
            );
        }
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        reset();
    }, [isOpen, reset]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Conversation">
            <form
                onSubmit={handleSubmit(onSubmit, (formErrors) => {
                    toast.error(
                        formErrors.connectCode?.message ?? "Invalid connect ID",
                    );
                })}
            >
                <label
                    htmlFor="connectCode"
                    className="block text-gray-700 mb-2 text-sm"
                >
                    Connect ID
                </label>

                <div className="relative mb-2">
                    <Wifi className="absolute inset-y-0 left-3 size-5 text-gray-400 top-1/2 -translate-y-1/2" />
                    <input
                        id="connectCode"
                        {...register("connectCode")}
                        className="text-black text-sm w-full pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pl-10"
                        placeholder="Enter connect ID"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isFetching}
                    className="w-full flex justify-center items-center bg-sky-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:cursor-not-allowed disabled:opacity-70 mt-4"
                >
                    {isFetching ? (
                        <Loader2 className="animate-spin size-5" />
                    ) : (
                        "Connect"
                    )}
                </button>
            </form>
        </Modal>
    );
};

export default AddConversationModal;
