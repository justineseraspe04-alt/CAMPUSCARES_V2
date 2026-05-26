package com.campuscares.dto.response;

public class DashboardCategoryCount {
    private String name;
    private long count;
    private int percent;

    public DashboardCategoryCount() {
    }

    public DashboardCategoryCount(String name, long count, int percent) {
        this.name = name;
        this.count = count;
        this.percent = percent;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public int getPercent() {
        return percent;
    }

    public void setPercent(int percent) {
        this.percent = percent;
    }
}
