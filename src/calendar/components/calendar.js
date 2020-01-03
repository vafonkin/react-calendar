import React, { Component } from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns";
import AddEventModal from "../../add-event";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { withNamespaces } from "react-i18next";
import "./calendar.css";

const EVENT_LIMIT = 5;

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      events: [],
      showEventModal: false,
      eventToEdit: {}
    };
  }

  componentDidMount() {
    let events =
      localStorage.getItem("CalendarEvents") !== ("undefined" && null)
        ? JSON.parse(localStorage.getItem("CalendarEvents"))
        : [];
    this.setState({ events: events });
  }

  handleLanguageChange(lang) {
    this.props.i18n.changeLanguage(lang);
  }

  rendeChangeLanguageButtons() {
    const languages = ["en", "de", "ru"];
    let buttons = [];
    for (let language of languages) {
      buttons.push(
        <Button
          key={language}
          variant="contained"
          color="secondary"
          onClick={() => {
            this.handleLanguageChange(language);
          }}
        >
          {language}
        </Button>
      );
    }
    return (
      <div className="language-div">
        <nav className="language-header">
          <ButtonGroup
            color="secondary"
            aria-label="outlined primary button group"
          >
            {buttons}
          </ButtonGroup>
        </nav>
      </div>
    );
  }

  renderHeader() {
    const dateFormat = "MMMM";
    const month = format(this.state.currentMonth, dateFormat) + "";
    const t = this.props.t;
    const i18n = this.props.i18n;
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>
            {t("month." + month, {
              lng: i18n.language
            })}
          </span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const days = [];
    const t = this.props.t;
    const i18n = this.props.i18n;
    for (let day of daysOfWeek) {
      days.push(
        <div className="col col-center" key={day}>
          {t("days." + day, { lng: i18n.language })}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate, events } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat, {
          useAdditionalDayOfYearTokens: false
        });
        const cloneDay = day;

        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day}
          >
            <span className="number">{formattedDate}</span>
            {isSameMonth(day, monthStart) ? (
              <div>
                <div>
                  {events
                    .filter(e => isSameDay(cloneDay, new Date(e.date)))
                    .sort((a, b) => (a.time > b.time ? 1 : -1))
                    .map((e, i) => (
                      <div
                        onClick={() => this.editEvent(e)}
                        key={i}
                        className="event-data"
                      >
                        {e.time} - {e.title}
                      </div>
                    ))}
                </div>
                <div key={"add-event-" + day} className="add-event-button">
                  <Fab
                    color="primary"
                    size="small"
                    aria-label="add"
                    onClick={() => this.onAddEventClick(cloneDay)}
                  >
                    <AddIcon />
                  </Fab>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  editEvent = e => {
    this.setState({ eventToEdit: e }, this.toggleModal);
  };

  nextMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: subMonths(this.state.currentMonth, 1)
    });
  };

  toggleModal = () => {
    const { showEventModal } = this.state;
    const newState = { showEventModal: !showEventModal };
    if (showEventModal) {
      newState.eventToEdit = {};
    }
    this.setState(newState);
  };

  onAddEventClick = date => {
    this.setState({ selectedDate: date });
    const { events } = this.state;
    if (
      events.filter(e => isSameDay(date, new Date(e.date))).length >=
      EVENT_LIMIT
    ) {
      alert(`You have reached maximum events limit for the selected day`);
    } else {
      this.setState({ selectedDate: date }, this.toggleModal);
    }
  };

  handleFormSubmit = ({ id, title, description, date, time }) => {
    console.log(title);
    const { selectedDate, events } = this.state;
    if (id) {
      const updatedEvent = {
        id,
        title,
        description,
        date,
        time
      };
      const eventIndex = events.findIndex(e => e.id === id);
      events.splice(eventIndex, 1, updatedEvent);
      this.setState({ events }, () => {
        this.toggleModal();
        const { events } = this.state;
        localStorage.setItem("CalendarEvents", JSON.stringify(events));
      });
    } else {
      const lastEvent = events[events.length - 1];
      const newEvent = {
        id: ((lastEvent && lastEvent.id) || 0) + 1,
        title,
        description,
        date: selectedDate,
        time
      };
      this.setState({ events: events.concat(newEvent) }, () => {
        this.toggleModal();
        const { events } = this.state;
        localStorage.setItem("CalendarEvents", JSON.stringify(events));
      });
    }
  };

  render() {
    const { showEventModal, eventToEdit } = this.state;
    return (
      <div className="calendar">
        {showEventModal && (
          <AddEventModal
            showModal={showEventModal}
            toggleModal={this.toggleModal}
            handleFormSubmit={this.handleFormSubmit}
            eventToEdit={eventToEdit}
          />
        )}
        {this.rendeChangeLanguageButtons()}
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}
export default withNamespaces()(Calendar);