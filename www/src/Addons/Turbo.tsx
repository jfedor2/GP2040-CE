import { useState } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FormCheck, Row } from 'react-bootstrap';
import * as yup from 'yup';

import { AppContext } from '../Contexts/AppContext';
import ColorPicker from '../Components/ColorPicker';
import Section from '../Components/Section';
import FormSelect from '../Components/FormSelect';
import FormControl from '../Components/FormControl';
import AnalogPinOptions from '../Components/AnalogPinOptions';
import { BUTTON_MASKS_OPTIONS } from '../Data/Buttons';
import { DUAL_STICK_MODES } from '../Data/Addons';
import LEDColors from '../Data/LEDColors';
import { ANALOG_PINS } from '../Data/Buttons';

const SHMUP_MIXED_MODES = [
	{ label: 'Turbo Priority', value: 0 },
	{ label: 'Charge Priority', value: 1 },
];

const TURBO_MASKS = [
	{ label: 'None', value: 0 },
	{ label: 'B1', value: 1 << 0 },
	{ label: 'B2', value: 1 << 1 },
	{ label: 'B3', value: 1 << 2 },
	{ label: 'B4', value: 1 << 3 },
	{ label: 'L1', value: 1 << 4 },
	{ label: 'R1', value: 1 << 5 },
	{ label: 'L2', value: 1 << 6 },
	{ label: 'R2', value: 1 << 7 },
	{ label: 'L3', value: 1 << 10 },
	{ label: 'R3', value: 1 << 11 },
];

export const turboScheme = {
	TurboInputEnabled: yup.number().required().label('Turbo Input Enabled'),
	turboPinLED: yup
		.number()
		.label('Turbo Pin LED')
		.validatePinWhenValue('TurboInputEnabled'),
	pinShmupBtn1: yup
		.number()
		.label('Charge Shot 1 Pin')
		.validatePinWhenValue('TurboInputEnabled'),
	pinShmupBtn2: yup
		.number()
		.label('Charge Shot 2 Pin')
		.validatePinWhenValue('TurboInputEnabled'),
	pinShmupBtn3: yup
		.number()
		.label('Charge Shot 3 Pin')
		.validatePinWhenValue('TurboInputEnabled'),
	pinShmupBtn4: yup
		.number()
		.label('Charge Shot 4 Pin')
		.validatePinWhenValue('TurboInputEnabled'),
	pinShmupDial: yup
		.number()
		.label('Shmup Dial Pin')
		.validatePinWhenValue('TurboInputEnabled'),
	turboShotCount: yup
		.number()
		.label('Turbo Shot Count')
		.validateRangeWhenValue('TurboInputEnabled', 2, 30),
	shmupMode: yup
		.number()
		.label('Shmup Mode Enabled')
		.validateRangeWhenValue('TurboInputEnabled', 0, 1),
	shmupMixMode: yup
		.number()
		.label('Shmup Mix Priority')
		.validateSelectionWhenValue('TurboInputEnabled', DUAL_STICK_MODES),
	shmupAlwaysOn1: yup
		.number()
		.label('Turbo-Button 1 (Always On)')
		.validateSelectionWhenValue('TurboInputEnabled', BUTTON_MASKS_OPTIONS),
	shmupAlwaysOn2: yup
		.number()
		.label('Turbo-Button 2 (Always On)')
		.validateSelectionWhenValue('TurboInputEnabled', BUTTON_MASKS_OPTIONS),
	shmupAlwaysOn3: yup
		.number()
		.label('Turbo-Button 3 (Always On)')
		.validateSelectionWhenValue('TurboInputEnabled', BUTTON_MASKS_OPTIONS),
	shmupAlwaysOn4: yup
		.number()
		.label('Turbo-Button 4 (Always On)')
		.validateSelectionWhenValue('TurboInputEnabled', BUTTON_MASKS_OPTIONS),
	shmupBtnMask1: yup
		.number()
		.label('Charge Shot Button 1 Map')
		.validateSelectionWhenValue('TurboInputEnabled', BUTTON_MASKS_OPTIONS),
	shmupBtnMask2: yup
		.number()
		.label('Charge Shot Button 2 Map')
		.validateSelectionWhenValue('TurboInputEnabled', BUTTON_MASKS_OPTIONS),
	shmupBtnMask3: yup
		.number()
		.label('Charge Shot Button 3 Map')
		.validateSelectionWhenValue('TurboInputEnabled', BUTTON_MASKS_OPTIONS),
	shmupBtnMask4: yup
		.number()
		.label('Charge Shot Button 4 Map')
		.validateSelectionWhenValue('TurboInputEnabled', BUTTON_MASKS_OPTIONS),
	turboLedType: yup.number().required().label('Turbo LED Type'),
	turboLedIndex: yup
		.number()
		.label('Turbo LED Index')
		.validateMinWhenEqualTo('turboLedType', 1, 0),
	turboLedColor: yup.string().label('RGB Turbo LED').validateColor(),
};

export const turboState = {
	pinShmupBtn1: -1,
	pinShmupBtn2: -1,
	pinShmupBtn3: -1,
	pinShmupBtn4: -1,
	pinShmupDial: -1,
	shmupAlwaysOn1: 0,
	shmupAlwaysOn2: 0,
	shmupAlwaysOn3: 0,
	shmupAlwaysOn4: 0,
	shmupBtnMask1: 0,
	shmupBtnMask2: 0,
	shmupBtnMask3: 0,
	shmupBtnMask4: 0,
	shmupMixMode: 0,
	shmupMode: 0,
	TurboInputEnabled: 0,
	turboPinLED: -1,
	turboShotCount: 5,
	turboLedType: 0,
	turboLedIndex: 0,
	turboLedColor: '#000000',
};

const Turbo = ({
	values,
	errors,
	handleChange,
	handleCheckbox,
	handleBlur,
	setFieldValue,
}) => {
	const { t } = useTranslation();

	const [colorPickerTarget, setColorPickerTarget] = useState(null);
	const [showPicker, setShowPicker] = useState(false);

	const toggleRgbPledPicker = (e) => {
		e.stopPropagation();
		setColorPickerTarget(e.target);
		setShowPicker(!showPicker);
	};

	const { usedPins } = useContext(AppContext);
	const availableAnalogPins = ANALOG_PINS.filter(
			(pin) => !usedPins?.includes(pin),
		);

	return (
		<Section title={
			<a
				href="https://gp2040-ce.info/add-ons/turbo"
				target="_blank"
				className="text-reset text-decoration-none"
			>
				{t('AddonsConfig:turbo-header-text')}
			</a>
		}
		>
			<div id="TurboInputOptions" hidden={!values.TurboInputEnabled}>
				<div className="alert alert-success" role="alert">
					{t('AddonsConfig:turbo-available-pins-text', {
						pins: availableAnalogPins.join(', '),
					})}
				</div>
				<Row className="mb-3">
					<FormSelect
						label={t('AddonsConfig:turbo-led-type-label')}
						name="turboLedType"
						className="form-select-sm"
						groupClassName="col-sm-2 mb-3"
						value={values.turboLedType}
						error={errors.turboLedType}
						isInvalid={errors.turboLedType}
						onChange={(e) =>
							setFieldValue('turboLedType', parseInt(e.target.value))
						}
					>
						<option value="-1" defaultValue={true}>
							{t('AddonsConfig:turbo-led-type-label-off')}
						</option>
						<option value="0">
							{t('AddonsConfig:turbo-led-type-label-pwm')}
						</option>
						<option value="1">
							{t('AddonsConfig:turbo-led-type-label-rgb')}
						</option>
					</FormSelect>
					<FormControl
						type="number"
						label={t('AddonsConfig:turbo-led-pin-label')}
						name="turboPinLED"
						hidden={parseInt(values.turboLedType) !== 0}
						className="form-select-sm"
						groupClassName="col-sm-3 mb-3"
						value={values.turboPinLED}
						error={errors.turboPinLED}
						isInvalid={errors.turboPinLED}
						onChange={handleChange}
						min={-1}
						max={29}
					/>
					<FormControl
						type="number"
						name="turboLedIndex"
						hidden={parseInt(values.turboLedType) !== 1}
						label={t('AddonsConfig:turbo-led-index-label')}
						className="form-control-sm"
						groupClassName="col-sm-2 mb-3"
						value={values.turboLedIndex}
						error={errors.turboLedIndex}
						isInvalid={errors.turboLedIndex}
						onChange={(e) =>
							setFieldValue('turboLedIndex', parseInt(e.target.value))
						}
						min={0}
					/>
					<FormControl
						label={t('AddonsConfig:turbo-led-color-label')}
						hidden={parseInt(values.turboLedType) !== 1}
						name="turboLedColor"
						className="form-control-sm"
						groupClassName="col-sm-2 mb-3"
						value={values.turboLedColor}
						error={errors.turboLedColor}
						isInvalid={errors.turboLedColor}
						onBlur={handleBlur}
						onClick={toggleRgbPledPicker}
						onChange={(e) => {
							handleChange(e);
							setShowPicker(false);
						}}
					/>
					<ColorPicker
						name="turboLedColor"
						types={[{ value: values.turboLedColor }]}
						onChange={(c) => setFieldValue('turboLedColor', c)}
						onDismiss={() => setShowPicker(false)}
						placement="top"
						presetColors={LEDColors.map((c) => ({
							title: c.name,
							color: c.value,
						}))}
						show={showPicker}
						target={colorPickerTarget}
					></ColorPicker>
				</Row>
				<Row className="mb-3">
					<FormControl
						type="number"
						label={t('AddonsConfig:turbo-shot-count-label')}
						name="turboShotCount"
						className="form-control-sm"
						groupClassName="col-sm-3 mb-3"
						value={values.turboShotCount}
						error={errors.turboShotCount}
						isInvalid={Boolean(errors.turboShotCount)}
						onChange={handleChange}
						min={2}
						max={30}
					/>
					<FormSelect
						label={t('AddonsConfig:turbo-shmup-dial-pin-label')}
						name="pinShmupDial"
						className="form-select-sm"
						groupClassName="col-sm-3 mb-3"
						value={values.pinShmupDial}
						error={errors.pinShmupDial}
						isInvalid={errors.pinShmupDial}
						onChange={handleChange}
					>
						<AnalogPinOptions />
					</FormSelect>
				</Row>
				<Row className="mb-3">
					<FormCheck
						label={t('AddonsConfig:turbo-shmup-mode-label')}
						type="switch"
						id="ShmupMode"
						className="col-sm-3 ms-3"
						isInvalid={false}
						checked={Boolean(values.shmupMode)}
						onChange={(e) => {
							handleCheckbox('shmupMode', values);
							handleChange(e);
						}}
					/>
					<div id="ShmupOptions" hidden={!values.shmupMode}>
						<Row className="mb-3">
							<FormSelect
								label={t('AddonsConfig:turbo-shmup-always-on-1-label')}
								name="shmupAlwaysOn1"
								className="form-select-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.shmupAlwaysOn1}
								error={errors.shmupAlwaysOn1}
								isInvalid={errors.shmupAlwaysOn1}
								onChange={handleChange}
							>
								{TURBO_MASKS.map((o, i) => (
									<option key={`shmupAlwaysOn1-option-${i}`} value={o.value}>
										{o.label}
									</option>
								))}
							</FormSelect>
							<FormSelect
								label={t('AddonsConfig:turbo-shmup-always-on-2-label')}
								name="shmupAlwaysOn2"
								className="form-select-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.shmupAlwaysOn2}
								error={errors.shmupAlwaysOn2}
								isInvalid={errors.shmupAlwaysOn2}
								onChange={handleChange}
							>
								{TURBO_MASKS.map((o, i) => (
									<option key={`shmupAlwaysOn2-option-${i}`} value={o.value}>
										{o.label}
									</option>
								))}
							</FormSelect>
							<FormSelect
								label={t('AddonsConfig:turbo-shmup-always-on-3-label')}
								name="shmupAlwaysOn3"
								className="form-select-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.shmupAlwaysOn3}
								error={errors.shmupAlwaysOn3}
								isInvalid={errors.shmupAlwaysOn3}
								onChange={handleChange}
							>
								{TURBO_MASKS.map((o, i) => (
									<option key={`shmupAlwaysOn3-option-${i}`} value={o.value}>
										{o.label}
									</option>
								))}
							</FormSelect>
							<FormSelect
								label={t('AddonsConfig:turbo-shmup-always-on-4-label')}
								name="shmupAlwaysOn4"
								className="form-select-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.shmupAlwaysOn4}
								error={errors.shmupAlwaysOn4}
								isInvalid={errors.shmupAlwaysOn4}
								onChange={handleChange}
							>
								{TURBO_MASKS.map((o, i) => (
									<option key={`shmupAlwaysOn4-option-${i}`} value={o.value}>
										{o.label}
									</option>
								))}
							</FormSelect>
						</Row>
						<Row className="mb-3">
							<FormControl
								type="number"
								label={t('AddonsConfig:turbo-shmup-button-1-label')}
								name="pinShmupBtn1"
								className="form-control-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.pinShmupBtn1}
								error={errors.pinShmupBtn1}
								isInvalid={errors.pinShmupBtn1}
								onChange={handleChange}
								min={-1}
								max={29}
							/>
							<FormControl
								type="number"
								label={t('AddonsConfig:turbo-shmup-button-2-label')}
								name="pinShmupBtn2"
								className="form-control-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.pinShmupBtn2}
								error={errors.pinShmupBtn2}
								isInvalid={errors.pinShmupBtn2}
								onChange={handleChange}
								min={-1}
								max={29}
							/>
							<FormControl
								type="number"
								label={t('AddonsConfig:turbo-shmup-button-3-label')}
								name="pinShmupBtn3"
								className="form-control-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.pinShmupBtn3}
								error={errors.pinShmupBtn3}
								isInvalid={errors.pinShmupBtn3}
								onChange={handleChange}
								min={-1}
								max={29}
							/>
							<FormControl
								type="number"
								label={t('AddonsConfig:turbo-shmup-button-4-label')}
								name="pinShmupBtn4"
								className="form-control-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.pinShmupBtn4}
								error={errors.pinShmupBtn4}
								isInvalid={errors.pinShmupBtn4}
								onChange={handleChange}
								min={-1}
								max={29}
							/>
						</Row>
						<Row className="mb-3">
							<FormSelect
								label={t('AddonsConfig:turbo-shmup-button-mask-1-label')}
								name="shmupBtnMask1"
								className="form-select-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.shmupBtnMask1}
								error={errors.shmupBtnMask1}
								isInvalid={errors.shmupBtnMask1}
								onChange={handleChange}
							>
								{TURBO_MASKS.map((o, i) => (
									<option key={`shmupBtnMask1-option-${i}`} value={o.value}>
										{o.label}
									</option>
								))}
							</FormSelect>
							<FormSelect
								label={t('AddonsConfig:turbo-shmup-button-mask-2-label')}
								name="shmupBtnMask2"
								className="form-select-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.shmupBtnMask2}
								error={errors.shmupBtnMask2}
								isInvalid={errors.shmupBtnMask2}
								onChange={handleChange}
							>
								{TURBO_MASKS.map((o, i) => (
									<option key={`shmupBtnMask2-option-${i}`} value={o.value}>
										{o.label}
									</option>
								))}
							</FormSelect>
							<FormSelect
								label={t('AddonsConfig:turbo-shmup-button-mask-3-label')}
								name="shmupBtnMask3"
								className="form-select-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.shmupBtnMask3}
								error={errors.shmupBtnMask3}
								isInvalid={errors.shmupBtnMask3}
								onChange={handleChange}
							>
								{TURBO_MASKS.map((o, i) => (
									<option key={`shmupBtnMask3-option-${i}`} value={o.value}>
										{o.label}
									</option>
								))}
							</FormSelect>
							<FormSelect
								label={t('AddonsConfig:turbo-shmup-button-mask-4-label')}
								name="shmupBtnMask4"
								className="form-select-sm"
								groupClassName="col-sm-3 mb-3"
								value={values.shmupBtnMask4}
								error={errors.shmupBtnMask4}
								isInvalid={errors.shmupBtnMask4}
								onChange={handleChange}
							>
								{TURBO_MASKS.map((o, i) => (
									<option key={`shmupBtnMask4-option-${i}`} value={o.value}>
										{o.label}
									</option>
								))}
							</FormSelect>
						</Row>
						<FormSelect
							label={t('AddonsConfig:turbo-shmup-mix-mode-label')}
							name="shmupMixMode"
							className="form-select-sm"
							groupClassName="col-sm-3 mb-3"
							value={values.shmupMixMode}
							error={errors.shmupMixMode}
							isInvalid={errors.shmupMixMode}
							onChange={handleChange}
						>
							{SHMUP_MIXED_MODES.map((o, i) => (
								<option
									key={`button-shmupMixedMode-option-${i}`}
									value={o.value}
								>
									{o.label}
								</option>
							))}
						</FormSelect>
					</div>
				</Row>
			</div>
			<FormCheck
				label={t('Common:switch-enabled')}
				type="switch"
				id="TurboInputButton"
				reverse
				isInvalid={false}
				checked={Boolean(values.TurboInputEnabled)}
				onChange={(e) => {
					handleCheckbox('TurboInputEnabled', values);
					handleChange(e);
				}}
			/>
		</Section>
	);
};

export default Turbo;
