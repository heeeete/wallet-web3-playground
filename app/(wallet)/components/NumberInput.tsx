import { Input } from "@/components/ui/input";

export default function NumberInput({ ...props }: React.ComponentProps<"input">) {
	const { onChange, ...rest } = props;

	const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		enforceNumberKey(e);
	};

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const next = sanitizeDecimal(e.currentTarget.value);

		if (next !== e.currentTarget.value) {
			e.currentTarget.value = next;
		}

		onChange?.(e);
	};
	return <Input onKeyDown={handleKeyDown} onChange={handleChange} {...rest} inputMode="decimal" />;
}

const enforceNumberKey: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
	// 조합키 단축키(복사/붙여넣기/전체선택 등)는 허용
	if (e.ctrlKey || e.metaKey || e.altKey) return;

	// 편집/이동 키 허용
	const allowed = new Set([
		"Backspace",
		"Delete",
		"Tab",
		"Enter",
		"Escape",
		"ArrowLeft",
		"ArrowRight",
		"ArrowUp",
		"ArrowDown",
		"Home",
		"End",
	]);
	if (allowed.has(e.key)) return;

	// 숫자만 허용 ('.', '-'는 막는 버전)
	if (/^[0-9]$/.test(e.key)) return;

	// '.'는 1개만 허용
	if (e.key === ".") {
		const value = e.currentTarget.value;
		if (value.includes(".")) {
			e.preventDefault();
		}
		return;
	}

	e.preventDefault();
};

function sanitizeDecimal(raw: string) {
	// 숫자와 '.'만 남김
	const only = raw.replace(/[^\d.]/g, "");

	// '.'는 첫 번째만 남기고 나머지는 제거
	const firstDot = only.indexOf(".");
	if (firstDot === -1) return only;

	const intPart = only.slice(0, firstDot);
	const fracPart = only.slice(firstDot + 1).replace(/\./g, ""); // 추가 점 제거
	return `${intPart}.${fracPart}`;
}
